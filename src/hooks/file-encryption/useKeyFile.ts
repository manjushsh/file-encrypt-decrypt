import { useCallback } from "react";
import { keyFileOperations } from "../../features/file-encryption/functions";

export const useKeyFile = (state: any, setState: any) => {
  const handleKeyFile = useCallback((file: File) => {
    keyFileOperations({ file, state, setState });
  }, [state, setState]);

  return { handleKeyFile };
};
