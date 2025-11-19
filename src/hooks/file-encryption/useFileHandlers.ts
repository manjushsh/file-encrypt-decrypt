import { DragEvent } from "react";
import { ENCRYPT, DECRYPT, KEY_FILE } from "../../context/GlobalStateContext";

interface UseFileHandlersParams {
  setState: (payload: any) => void;
  handleEncryptFiles: (files: File[]) => Promise<void>;
  handleDecryptFiles: (files: File[]) => Promise<void>;
  handleKeyFile: (file: File) => void;
}

export const useFileHandlers = ({
  setState,
  handleEncryptFiles,
  handleDecryptFiles,
  handleKeyFile
}: UseFileHandlersParams) => {
  
  const extractFilesFromDataTransfer = (items: DataTransferItemList): File[] => {
    return Array.from(items)
      .filter(item => item.kind === "file")
      .map(item => item.getAsFile())
      .filter((file): file is File => file !== null);
  };

  const processFiles = async (files: File[], type: string) => {
    try {
      switch (type) {
        case ENCRYPT:
          await handleEncryptFiles(files);
          break;
        case DECRYPT:
          await handleDecryptFiles(files);
          break;
        case KEY_FILE:
          handleKeyFile(files[0]);
          break;
        default:
          console.warn('Unknown operation type:', type);
      }
    } catch (error) {
      console.error('Error processing files:', error);
      setState({ fileEncryptionLoader: false });
    }
  };

  const dropHandler = async (ev: DragEvent, type: string) => {
    ev.preventDefault();
    setState({ type });

    const items = ev?.dataTransfer?.items;
    if (!items?.length) return;

    const files = extractFilesFromDataTransfer(items);
    if (!files.length) return;

    await processFiles(files, type);
  };

  const fileSelectHandler = async (ev: React.ChangeEvent<HTMLInputElement>, type: string) => {
    ev.preventDefault();
    setState({ type });

    const fileList = ev?.currentTarget?.files;
    if (!fileList?.length) return;

    const files = Array.from(fileList);
    await processFiles(files, type);
  };

  return { dropHandler, fileSelectHandler };
};
