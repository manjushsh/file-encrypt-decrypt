import FileUploader from "../common/file-upload";
import { KEY_FILE } from "../../context/GlobalStateContext";

interface KeyFileSectionProps {
  dropHandler: (ev: React.DragEvent, type: string) => void;
  filePickHandler: (ev: React.ChangeEvent<HTMLInputElement>, type: string) => void;
}

const KeyFileSection = ({ dropHandler, filePickHandler }: KeyFileSectionProps) => {
  return (
    <section className="decrypt-file-container" aria-label="Decryption key file upload">
      <FileUploader
        dropHandler={dropHandler}
        filePickHandler={filePickHandler}
        type={KEY_FILE}
        message="Drag and drop or select key file to start Decryption"
      />
    </section>
  );
};

export default KeyFileSection;
