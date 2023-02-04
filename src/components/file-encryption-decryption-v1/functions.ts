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
  
export const decryptionOperations = async ({ file, state, setState }: any) => {
    const iv: any = state.iv || state.IV;
    setState({ fileEncryptionLoader: true });
    const arrayBuffer: ArrayBuffer = await commonFileOperations(file);
    const blob = await EncryptionService.decryptUploadedFile(arrayBuffer, iv, state.key);
    const fileName = file?.name?.startsWith("encrypted") ? file.name.replace(/encrypted-/i, "") : file.name;
    DownloadService.downloadBlob(blob, `${fileName}`);
    setState({ fileEncryptionLoader: false });
  }
  
  export const keyFileOperations = async ({ file, state, setState }: any) => {
    if (file.type === "application/json") {
      const data: any = await EncryptionService.fileToJSON(file);
      const keyFile = JSON.parse(data);
      if (keyFile.iv && keyFile.key)
        setState({ ...keyFile, keyFileUploaded: true });
      else alert("Uploaded JSON is not an valid key file!");
    }
    else if (file.name.startsWith('qrcode-key')) {
      scanImageQR(file, setState);
    }
    else {
      alert(
        "Uploaded file is not a valid key file. Please check file and reupload again. It should be an JSON file."
      );
    }
  }
  
  export const scanImageQR = async (imageFile: File, setState: any) => {
    const base64 = await DownloadService.fileToBase64(imageFile);
    QrScanner.scanImage(base64, {
      alsoTryWithoutScanRegion: true,
      returnDetailedScanResult: true,
    })
      .then(result => {
        const keyFile = JSON.parse(result?.data);
        setState({ ...keyFile, keyFileUploaded: true });
      })
      .catch(error => console.log(error || 'No QR code found.'));
  };
