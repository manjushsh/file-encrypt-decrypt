import { use, useEffect, useOptimistic, Activity } from "react";
import { ActivityStatates, ENCRYPT, GlobalStateContext } from "../../context/GlobalStateContext";
import EncryptionService from "../../services/encryption-service";
import { useFileEncryption } from "../../hooks/file-encryption/useFileEncryption";
import { useFileDecryption } from "../../hooks/file-encryption/useFileDecryption";
import { useKeyFile } from "../../hooks/file-encryption/useKeyFile";
import { useFileHandlers } from "../../hooks/file-encryption/useFileHandlers";
import { EncryptionZone } from "./components/EncryptionZone";
import { DecryptionZone } from "./components/DecryptionZone";
import { KeyFileZone } from "./components/KeyFileZone";
import './styles.css'
import "../../css/index.css";

declare global {
  interface Window {
    QRCode: any;
  }
}

const FileEncryptDecrypt = () => {
  const { state, setState, resetState } = use(GlobalStateContext);
  const [optimisticLoading, setOptimisticLoading] = useOptimistic(
    state?.fileEncryptionLoader || false
  );

  const { handleEncryptFiles } = useFileEncryption(state, setState, setOptimisticLoading);
  const { handleDecryptFiles } = useFileDecryption(state, setState, setOptimisticLoading);
  const { handleKeyFile } = useKeyFile(state, setState);
  
  const { dropHandler, fileSelectHandler } = useFileHandlers({
    setState,
    handleEncryptFiles,
    handleDecryptFiles,
    handleKeyFile
  });

  useEffect(() => {
    const initializeEncryption = async () => {
      try {
        const { algorithm, IV, key } = await EncryptionService.generateRandomKey();
        setState({
          fileEncryptionLoader: false,
          algorithm,
          IV,
          key,
          keyFile: null
        });
      } catch (error) {
        console.error('Error initializing encryption:', error);
      }
    };

    initializeEncryption();
  }, [setState]);

  const isKeyFileUploaded = state?.keyFileUploaded;

  return (
    <Activity mode={(!state?.type || state?.type === ENCRYPT) ? ActivityStatates.VISIBLE : ActivityStatates.HIDDEN}>
      <section className="en-decr-container">
        {!isKeyFileUploaded ? (
          <>
            <EncryptionZone 
              dropHandler={dropHandler} 
              filePickHandler={fileSelectHandler}
            />
            <KeyFileZone 
              dropHandler={dropHandler} 
              filePickHandler={fileSelectHandler}
            />
          </>
        ) : (
          <DecryptionZone 
            dropHandler={dropHandler} 
            filePickHandler={fileSelectHandler}
            onGoBack={resetState}
          />
        )}

        <section hidden className="qrcode" id="qrcode">
          <img id="qrcode-img" alt="QR Code" />
        </section>
      </section>
    </Activity>
  );
};

export default FileEncryptDecrypt;
