import { useCallback } from "react";
import { keyFileOperations } from "../../features/file-encryption/functions";

export const useKeyFile = (state: any, setState: any) => {
  const handleKeyFile = useCallback(async (file: File) => {
    try {
      await keyFileOperations({ file, state, setState });
    } catch (error) {
      console.error('Error handling key file:', error);
      // Ensure state is reset on error
      setState({ keyFileUploaded: false });
    }
  }, [state, setState]);

  return { handleKeyFile };
};
