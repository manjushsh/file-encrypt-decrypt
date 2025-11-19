import { useCallback } from "react";
import { startTransition } from "react";
import { decryptionOperations } from "../../features/file-encryption/functions";

export const useFileDecryption = (state: any, setState: any, setOptimisticLoading: any) => {
  const handleDecryptFiles = useCallback(async (files: File[]) => {
    const iv = state.iv || state.IV;
    if (!state.key || !iv) {
      console.warn('Missing key or IV for decryption');
      return;
    }

    startTransition(() => {
      setOptimisticLoading(true);
    });

    for (const file of files) {
      await decryptionOperations({ file, state, setState });
    }

    startTransition(() => {
      setOptimisticLoading(false);
    });
  }, [state, setState, setOptimisticLoading]);

  return { handleDecryptFiles };
};
