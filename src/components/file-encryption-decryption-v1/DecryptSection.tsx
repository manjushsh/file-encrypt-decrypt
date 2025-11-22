import FileUploader from "../common/file-upload";
import { DECRYPT } from "../../context/GlobalStateContext";

interface DecryptSectionProps {
  dropHandler: (ev: React.DragEvent, type: string) => void;
  filePickHandler: (ev: React.ChangeEvent<HTMLInputElement>, type: string) => void;
}

const DecryptSection = ({ dropHandler, filePickHandler }: DecryptSectionProps) => {
  return (
    <div className="encrypt-file-container">
      <FileUploader
        dropHandler={dropHandler}
        filePickHandler={filePickHandler}
        type={DECRYPT}
        message="Drag and drop or select file(s) to start Decryption"
      />
    </div>
  );
};

export default DecryptSection;
