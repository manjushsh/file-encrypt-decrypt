import { DragEvent } from "react";

export interface EncryptionOperationsParams {
  file: File;
  state: any;
  setState: (payload: any) => void;
}

export interface EncryptDecryptLandingProps {
  dropHandler: (ev: DragEvent, type: string) => Promise<void>;
  filePickHandler: (ev: React.ChangeEvent<HTMLInputElement>, type: string) => Promise<void>;
}
