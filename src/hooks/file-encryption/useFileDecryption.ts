import { useCallback } from "react";
import { decryptionOperations } from "../../features/file-encryption/functions";

export const useFileDecryption = (state: any, setState: any) => {
  const handleDecryptFiles = useCallback(async (files: File[]) => {
    const iv = state.iv || state.IV;
    if (!state.key || !iv) {
      console.warn('Missing key or IV for decryption');
      return;
    }

    for (const file of files) {
      await decryptionOperations({ file, state, setState });
    }
  }, [state, setState]);

  return { handleDecryptFiles };
};
