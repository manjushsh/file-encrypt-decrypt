import FileUploader from "../common/file-upload";
import { ENCRYPT } from "../../context/GlobalStateContext";

interface EncryptSectionProps {
  dropHandler: (ev: React.DragEvent, type: string) => void;
  filePickHandler: (ev: React.ChangeEvent<HTMLInputElement>, type: string) => void;
}

const EncryptSection = ({ dropHandler, filePickHandler }: EncryptSectionProps) => {
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

export default EncryptSection;
