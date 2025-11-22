import { useContext } from "react";
import { GlobalStateContext } from "../../context/GlobalStateContext";
import EncryptSection from "./EncryptSection";
import DecryptSection from "./DecryptSection";
import KeyFileSection from "./KeyFileSection";
import GoBackButton from "./GoBackButton";
import ThemeToggle from "../common/theme-toggle";
import Header from "../common/header";
import Footer from "../common/footer";

interface EncryptDecryptLandingProps {
  dropHandler: (ev: React.DragEvent, type: string) => void;
  filePickHandler: (ev: React.ChangeEvent<HTMLInputElement>, type: string) => void;
}

const EncryptDecryptLanding = ({ dropHandler, filePickHandler }: EncryptDecryptLandingProps) => {
  const { state, resetState } = useContext(GlobalStateContext);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <ThemeToggle />
      <Header />
      <section 
        className={`en-decr-container ${state?.keyFileUploaded ? 'single-card-mode' : ''}`}
        role="main" 
        aria-label="File encryption and decryption interface"
      >
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

        <section hidden className="qrcode" id="qrcode" aria-hidden="true">
          <img id="qrcode-img" alt="" />
        </section>
      </section>
      <Footer />
    </div>
  );
};

export default EncryptDecryptLanding;
