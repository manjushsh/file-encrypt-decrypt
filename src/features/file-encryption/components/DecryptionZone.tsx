import { DECRYPT } from "../../../context/GlobalStateContext";
import FileUploader from "../../../components/common/file-upload";
import { EncryptDecryptLandingProps } from "../index.d";

interface DecryptionZoneProps extends Omit<EncryptDecryptLandingProps, 'children'> {
  onGoBack: () => void;
}

export const DecryptionZone = ({ dropHandler, filePickHandler, onGoBack }: DecryptionZoneProps) => {
  return (
    <>
      <div className="encrypt-file-container">
        <FileUploader
          dropHandler={dropHandler}
          filePickHandler={filePickHandler}
          type={DECRYPT}
          message="Drag and drop or select file(s) to start Decryption"
        />
      </div>

      <div className="go-back-container" onClick={onGoBack}>
        <div className="centered">
          <label className="file-title">
            <h1>&larr;&ensp;Go Back</h1>
          </label>
        </div>
      </div>
    </>
  );
};
