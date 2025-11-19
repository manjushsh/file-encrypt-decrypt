import QrScanner from "qr-scanner";
import ConfigService from "../../services/config-service";
import DownloadService from "../../services/download-service";
import EncryptionService from "../../services/encryption-service";
import { KeyExportTypes } from "../../types";
import { FileOperationParams } from "./index.d";

const { QRCode } = window;

// Constants
const QR_CODE_ELEMENT_ID = 'qrcode';
const ENCRYPTED_FILE_PREFIX = 'encrypted-';
const QRCODE_KEY_PREFIX = 'qrcode-key';
const FILE_TYPE_JSON = 'application/json';

export const getNewQRCodeObject = () => {
    const name = "qrcode";
    return new QRCode(name, {
        ...ConfigService.QR_CODE_CONFIG,
        correctLevel: QRCode.CorrectLevel.H,
    });
}

/**
 * Converts a File to ArrayBuffer for encryption/decryption operations
 */
export const fileToArrayBuffer = async (file: File): Promise<ArrayBuffer> => {
    return await file.arrayBuffer();
}

/**
 * Downloads encryption key as both QR code image and JSON file
 */
export const downloadFiles = ({ algorithm, iv, key }: KeyExportTypes): void => {
    try {
        const keyData = { algorithm, iv, key };
        const jsonString = JSON.stringify(keyData);
        const timestamp = Date.now();
        
        // Generate and download QR code
        const qrCode = getNewQRCodeObject();
        qrCode.makeCode(jsonString);
        
        const qrElement = document.getElementById(QR_CODE_ELEMENT_ID);
        const canvas = qrElement?.querySelector('canvas');
        const dataUrl = canvas?.toDataURL();
        
        if (dataUrl) {
            DownloadService.downloadURI(dataUrl, `${QRCODE_KEY_PREFIX}-${timestamp}`);
        }
        
        // Download JSON key file
        const jsonBlob = new Blob([jsonString], { type: FILE_TYPE_JSON });
        DownloadService.downloadBlob(jsonBlob, `key-${timestamp}.json`);
    } catch (error) {
        console.error('Error downloading key files:', error);
        throw new Error('Failed to download encryption key files');
    }
}
  
/**
 * Decrypts an encrypted file and triggers download
 */
export const decryptionOperations = async ({ file, state, setState }: FileOperationParams): Promise<void> => {
    try {
        const iv = state.iv || state.IV;
        
        if (!iv || !state.key) {
            throw new Error('Missing encryption key or initialization vector');
        }
        
        setState({ fileEncryptionLoader: true });
        
        const arrayBuffer = await fileToArrayBuffer(file);
        const decryptedBlob = await EncryptionService.decryptUploadedFile(arrayBuffer, iv, state.key);
        
        // Remove 'encrypted-' prefix if present
        const fileName = file.name.startsWith(ENCRYPTED_FILE_PREFIX) 
            ? file.name.replace(new RegExp(`^${ENCRYPTED_FILE_PREFIX}`, 'i'), '') 
            : file.name;
        
        DownloadService.downloadBlob(decryptedBlob, fileName);
    } catch (error) {
        console.error('Decryption failed:', error);
        throw error;
    } finally {
        setState({ fileEncryptionLoader: false });
    }
}
  
/**
 * Validates and processes uploaded key file (JSON or QR code image)
 */
export const keyFileOperations = async ({ file, state, setState }: FileOperationParams): Promise<void> => {
    try {
        if (file.type === FILE_TYPE_JSON) {
            await handleJsonKeyFile(file, setState);
        } else if (file.name.startsWith(QRCODE_KEY_PREFIX)) {
            await scanImageQR(file, setState);
        } else {
            throw new Error('Invalid key file format. Please upload a JSON key file or QR code image.');
        }
    } catch (error) {
        console.error('Key file processing failed:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to process key file';
        alert(errorMessage);
        // Reset to initial state on error
        setState({ keyFileUploaded: false, keyFile: null });
    }
}

/**
 * Handles JSON key file validation and state update
 */
const handleJsonKeyFile = async (file: File, setState: (payload: any) => void): Promise<void> => {
    try {
        const data = await EncryptionService.fileToJSON(file);
        const keyFile = JSON.parse(data as string);
        
        if (!keyFile.iv || !keyFile.key) {
            throw new Error('Invalid key file: missing required fields (iv, key)');
        }
        
        if (!keyFile.algorithm) {
            // Add default algorithm if missing for backward compatibility
            keyFile.algorithm = 'AES-GCM';
        }
        
        setState({ ...keyFile, keyFileUploaded: true });
    } catch (error) {
        if (error instanceof SyntaxError) {
            throw new Error('Invalid JSON format in key file');
        }
        throw error;
    }
}
  
/**
 * Scans QR code from image file and extracts encryption key
 */
export const scanImageQR = async (imageFile: File, setState: (payload: any) => void): Promise<void> => {
    try {
        const base64 = await DownloadService.fileToBase64(imageFile);
        
        const result = await QrScanner.scanImage(base64, {
            alsoTryWithoutScanRegion: true,
            returnDetailedScanResult: true,
        });
        
        if (!result?.data) {
            throw new Error('No QR code found in image');
        }
        
        const keyFile = JSON.parse(result.data);
        
        if (!keyFile.iv || !keyFile.key) {
            throw new Error('Invalid QR code: missing encryption key data');
        }
        
        setState({ ...keyFile, keyFileUploaded: true });
    } catch (error) {
        console.error('QR code scanning failed:', error);
        throw new Error('Failed to scan QR code. Please ensure the image contains a valid encryption key QR code.');
    }
}
