import QrScanner from "qr-scanner";
import ConfigService from "../../services/config-service";
import DownloadService from "../../services/download-service";
import EncryptionService from "../../services/encryption-service";
import { KeyExportTypes } from "../../types";
const { QRCode } = window;

export const getNewQRCodeObject = () => {
    const name = "qrcode";
    return new QRCode(name, {
        ...ConfigService.QR_CODE_CONFIG,
        correctLevel: QRCode.CorrectLevel.H,
    });
}

export const commonFileOperations = async (file: File) => {
    const blobOfFile: Blob = new Blob([file]);
    const arrayBuffer: ArrayBuffer = await blobOfFile.arrayBuffer();
    return arrayBuffer;
}

export const downloadFiles = ({ algorithm, iv, key }: KeyExportTypes) => {
    const JSONToExport = JSON.stringify({ algorithm, iv, key: key });
    const dateNow = Date.now();
    const QR_CODE = getNewQRCodeObject();
    QR_CODE.makeCode(JSONToExport);
    const dataUrl = document.getElementById('qrcode')?.querySelector('canvas')?.toDataURL() || '';
    DownloadService.downloadURI(dataUrl, `qrcode-key-${dateNow}`);
    const JSONBlob: Blob = new Blob([JSONToExport], { type: "application/json" });
    DownloadService.downloadBlob(JSONBlob, `key-${dateNow}.json`);
}
  
export const decryptionOperations = async ({ file, state, setState }: any, showToast?: any) => {
    const iv: any = state.iv || state.IV;
    setState({ fileEncryptionLoader: true });
    const arrayBuffer: ArrayBuffer = await commonFileOperations(file);
    const blob = await EncryptionService.decryptUploadedFile(arrayBuffer, iv, state.key);
    const fileName = file?.name?.startsWith("encrypted") ? file.name.replace(/encrypted-/i, "") : file.name;
    DownloadService.downloadBlob(blob, `${fileName}`);
    setState({ fileEncryptionLoader: false });
    if (showToast) {
      showToast("Files are decrypted and downloaded successfully.", "success");
    }
  }
  
export const keyFileOperations = async ({ file, setState }: any, showToast?: any) => {
  try {
    if (file.type === "application/json") {
      const data: any = await EncryptionService.fileToJSON(file);
      const keyFile = JSON.parse(data);
      if (keyFile.iv && keyFile.key && keyFile.algorithm) {
        setState({ ...keyFile, keyFileUploaded: true });
      } else {
        if (showToast) {
          showToast("Uploaded JSON is not a valid key file! Missing required fields (iv, key, algorithm).", "error");
        }
        // Reset the file input to allow re-selection
        setState({ keyFileUploaded: false });
      }
    }
    else if (file.name.startsWith('qrcode-key')) {
      scanImageQR(file, setState, showToast);
    }
    else {
      if (showToast) {
        showToast(
          "Uploaded file is not a valid key file. Please upload a JSON file or QR code image.",
          "error"
        );
      }
      // Reset the file input instead of reloading
      setState({ keyFileUploaded: false });
    }
  } catch (error) {
    console.error('Error processing key file:', error);
    if (showToast) {
      showToast("Failed to read key file. Please check the file format and try again.", "error");
    }
    setState({ keyFileUploaded: false });
  }
}

export const scanImageQR = async (imageFile: File, setState: any, showToast?: any) => {
    try {
      const base64 = await DownloadService.fileToBase64(imageFile);
      const result = await QrScanner.scanImage(base64, {
        alsoTryWithoutScanRegion: true,
        returnDetailedScanResult: true,
      });
      
      const keyFile = JSON.parse(result?.data);
      if (keyFile.iv && keyFile.key && keyFile.algorithm) {
        setState({ ...keyFile, keyFileUploaded: true });
      } else {
        if (showToast) {
          showToast("QR code does not contain valid key data.", "error");
        }
        setState({ keyFileUploaded: false });
      }
    } catch (error) {
      console.error('Error scanning QR code:', error);
      if (showToast) {
        showToast("Failed to scan QR code. Please ensure it's a valid SecureFiles key QR code.", "error");
      }
      setState({ keyFileUploaded: false });
    }
}
