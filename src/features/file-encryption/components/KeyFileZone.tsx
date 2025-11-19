import { KEY_FILE } from "../../../context/GlobalStateContext";
import FileUploader from "../../../components/common/file-upload";
import { EncryptDecryptLandingProps } from "../index.d";

export const KeyFileZone = ({ dropHandler, filePickHandler }: Omit<EncryptDecryptLandingProps, 'children'>) => {
  return (
      <div className="decrypt-file-container">
        <FileUploader
          dropHandler={dropHandler}
          filePickHandler={filePickHandler}
          type={KEY_FILE}
          message="Drag and drop or select key file to start Decryption"
        />
      </div>
  );
};
