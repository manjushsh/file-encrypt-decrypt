import { useCallback } from "react";
import JSZip from 'jszip';
import EncryptionService from "../../services/encryption-service";
import ConfigService from "../../services/config-service";
import { commonFileOperations, downloadFiles } from "../../features/file-encryption/functions";

let zip = new JSZip();

function resetZip() {
  zip.forEach(item => zip.remove(item));
  zip = new JSZip();
  return zip;
}

export const encryptionOperations = async ({ file, state, setState }: any) => {
  const { algorithm, IV, key } = state;
  const arrayBuffer: ArrayBuffer = await commonFileOperations(file);
  setState({ fileEncryptionLoader: true });
  const { blob } = await EncryptionService.encryptFileUsingAlgorithm(arrayBuffer, algorithm, IV, key);
  zip = zip.file(`encrypted-${file.name}`, blob);
}

export const useFileEncryption = (state: any, setState: any, setOptimisticLoading: any) => {
  const handleEncryptFiles = useCallback(async (files: File[]) => {
    zip = resetZip();

    for (const file of files) {
      await encryptionOperations({ file, state, setState });
    }

    setState({ fileEncryptionLoader: false, keyFileUploaded: false });

    const { algorithm, IV, key } = state;
    const exportedKey = await EncryptionService.exportKeyAsJWT(key);
    downloadFiles({ algorithm, iv: String(IV), key: exportedKey });

    const content = await zip.generateAsync({ ...ConfigService.ZIP_CONFIG, type: "base64" });
    window.location.href = "data:application/zip;base64," + content;
  }, [state, setState]);

  return { handleEncryptFiles };
};
