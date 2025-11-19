import { ENCRYPT } from "../../../context/GlobalStateContext";
import FileUploader from "../../../components/common/file-upload";
import { EncryptDecryptLandingProps } from "../index.d";

export const EncryptionZone = ({ dropHandler, filePickHandler }: Omit<EncryptDecryptLandingProps, 'children'>) => {
  return (
      <div className="encrypt-file-container">
        <FileUploader
          dropHandler={dropHandler}
          filePickHandler={filePickHandler}
          type={ENCRYPT}
          message="Drag and drop or select file(s) here to start Encryption"
        />
      </div>
  );
};
