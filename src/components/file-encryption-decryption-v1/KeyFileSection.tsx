import FileUploader from "../common/file-upload";
import { KEY_FILE } from "../../context/GlobalStateContext";

interface KeyFileSectionProps {
  dropHandler: (ev: React.DragEvent, type: string) => void;
  filePickHandler: (ev: React.ChangeEvent<HTMLInputElement>, type: string) => void;
}

const KeyFileSection = ({ dropHandler, filePickHandler }: KeyFileSectionProps) => {
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

export default KeyFileSection;
