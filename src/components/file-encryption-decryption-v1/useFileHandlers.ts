import { DragEvent, useContext } from "react";
import { DECRYPT, ENCRYPT, GlobalStateContext, KEY_FILE } from "../../context/GlobalStateContext";
import { useToast } from "../common/toast/ToastContainer";
import EncryptionService from "../../services/encryption-service";
import ConfigService from "../../services/config-service";
import { decryptionOperations, downloadFiles, keyFileOperations } from "./functions";
import { encryptionOperations, resetZip, getZip } from "./EncryptionOperations";

declare global {
  interface Window {
    QRCode: any;
  }
}

export const useFileHandlers = () => {
  const { state, setState } = useContext(GlobalStateContext);
  const { showToast } = useToast();

  const dropHandler = async (ev: DragEvent, type: string) => {
    try {
      ev.preventDefault();
      setState({ type });
      const files = ev?.dataTransfer?.items;
      
      if (files?.length) {
        await handleFiles(Array.from(files), type);
      }
    } catch (error) {
      console.error('Error handling file drop:', error);
      showToast('Failed to process dropped files. Please try again.', 'error');
    }
  };

  const fileSelectHandler = async (ev: React.ChangeEvent<HTMLInputElement>, type: string) => {
    try {
      ev.preventDefault();
      setState({ type });
      const files = ev?.currentTarget?.files!;
      
      if (files?.length) {
        await handleFilesFromInput(Array.from(files), type);
      }
    } catch (error) {
      console.error('Error handling file selection:', error);
      showToast('Failed to process selected files. Please try again.', 'error');
    }
  };

  const handleFiles = async (items: DataTransferItem[], type: string) => {
    switch (type) {
      case ENCRYPT:
        await handleEncryptionFromDrop(items);
        break;
      case DECRYPT:
        await handleDecryptionFromDrop(items);
        break;
      case KEY_FILE:
        await handleKeyFileFromDrop(items);
        break;
      default:
        break;
    }
  };

  const handleFilesFromInput = async (files: File[], type: string) => {
    switch (type) {
      case ENCRYPT:
        await handleEncryptionFromInput(files);
        break;
      case DECRYPT:
        await handleDecryptionFromInput(files);
        break;
      case KEY_FILE:
        await handleKeyFileFromInput(files);
        break;
      default:
        break;
    }
  };

  const handleEncryptionFromDrop = async (items: DataTransferItem[]) => {
    resetZip();
    
    for (let item of items) {
      if (item.kind === "file") {
        const file = item.getAsFile()!;
        await encryptionOperations({ file, state, setState });
      }
    }
    
    await finalizeEncryption();
  };

  const handleEncryptionFromInput = async (files: File[]) => {
    resetZip();
    
    for (let file of files) {
      await encryptionOperations({ file, state, setState });
    }
    
    await finalizeEncryption();
  };

  const finalizeEncryption = async () => {
    setState({ fileEncryptionLoader: false, keyFileUploaded: false });
    const { algorithm, IV, key } = state;
    const exportedKey = await EncryptionService.exportKeyAsJWT(key);
    downloadFiles({ algorithm, iv: String(IV).toString(), key: exportedKey });
    
    await getZip().generateAsync({ ...ConfigService.ZIP_CONFIG, type: "base64" }).then(content => {
      window.location.href = "data:application/zip;base64," + content;
      showToast("Files are encrypted and downloaded successfully.", "success");
    });
  };

  const handleDecryptionFromDrop = async (items: DataTransferItem[]) => {
    const iv: any = state.iv || state.IV;
    
    if (state.key && iv) {
      for (let item of items) {
        if (item.kind === "file") {
          const file = item.getAsFile()!;
          await decryptionOperations({ file, state, setState }, showToast);
        }
      }
    }
  };

  const handleDecryptionFromInput = async (files: File[]) => {
    const iv: any = state.iv || state.IV;
    
    if (state.key && iv) {
      for (let file of files) {
        await decryptionOperations({ file, state, setState }, showToast);
      }
    }
  };

  const handleKeyFileFromDrop = async (items: DataTransferItem[]) => {
    if (items[0].kind === "file") {
      const file = items[0].getAsFile()!;
      keyFileOperations({ file, setState }, showToast);
    }
  };

  const handleKeyFileFromInput = async (files: File[]) => {
    const file = files[0];
    keyFileOperations({ file, setState }, showToast);
  };

  return { dropHandler, fileSelectHandler };
};
