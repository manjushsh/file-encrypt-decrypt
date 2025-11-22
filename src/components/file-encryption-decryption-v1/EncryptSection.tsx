import FileUploader from "../common/file-upload";
import { ENCRYPT } from "../../context/GlobalStateContext";

interface EncryptSectionProps {
  dropHandler: (ev: React.DragEvent, type: string) => void;
  filePickHandler: (ev: React.ChangeEvent<HTMLInputElement>, type: string) => void;
}

const EncryptSection = ({ dropHandler, filePickHandler }: EncryptSectionProps) => {
  return (
    <section className="encrypt-file-container" aria-label="File encryption">
      <FileUploader
        dropHandler={dropHandler}
        filePickHandler={filePickHandler}
        type={ENCRYPT}
        message="Drag and drop or select file(s) here to start Encryption"
      />
    </section>
  );
};

export default EncryptSection;
