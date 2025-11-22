import { useContext } from "react";
import { GlobalStateContext } from "../../context/GlobalStateContext";
import EncryptSection from "./EncryptSection";
import DecryptSection from "./DecryptSection";
import KeyFileSection from "./KeyFileSection";
import GoBackButton from "./GoBackButton";

interface EncryptDecryptLandingProps {
  dropHandler: (ev: React.DragEvent, type: string) => void;
  filePickHandler: (ev: React.ChangeEvent<HTMLInputElement>, type: string) => void;
}

const EncryptDecryptLanding = ({ dropHandler, filePickHandler }: EncryptDecryptLandingProps) => {
  const { state, resetState } = useContext(GlobalStateContext);

  return (
    <section className="en-decr-container">
      {!state?.keyFileUploaded && (
        <EncryptSection dropHandler={dropHandler} filePickHandler={filePickHandler} />
      )}

      {state?.keyFileUploaded && (
        <DecryptSection dropHandler={dropHandler} filePickHandler={filePickHandler} />
      )}

      {!state?.keyFileUploaded && (
        <KeyFileSection dropHandler={dropHandler} filePickHandler={filePickHandler} />
      )}

      {state?.keyFileUploaded && (
        <GoBackButton onClick={resetState} />
      )}

      <section hidden className="qrcode" id="qrcode">
        <img id="qrcode-img" alt="" />
      </section>
    </section>
  );
};

export default EncryptDecryptLanding;
