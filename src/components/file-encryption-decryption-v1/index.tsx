import { DragEvent, useContext, useEffect } from "react";
import JSZip from 'jszip';
import { DECRYPT, ENCRYPT, GlobalStateContext, KEY_FILE } from "../../context/GlobalStateContext";
import EncryptionService from "../../services/encryption-service";
import ConfigService from "../../services/config-service";
import FileUploader from "../common/file-upload";
import { commonFileOperations, decryptionOperations, downloadFiles, keyFileOperations } from "./functions";
import './styles.css'
import "../../css/index.css";

declare global {
  interface Window {
    QRCode: any;
  }
}
let zip = new JSZip();

function resetZip(){
  zip.forEach(item => zip.remove(item));
  zip = new JSZip();
  return zip;
}

export const encryptionOperations = async ({ file, state, setState }: any) => {
  const { algorithm, IV, key } = state;
  const arrayBuffer: ArrayBuffer = await commonFileOperations(file);
  setState({ fileEncryptionLoader: true, });
  const { blob } = await EncryptionService.encryptFileUsingAlgorithm(arrayBuffer, algorithm, IV, key);
  zip = zip.file(`encrypted-${file.name}`, blob);
}

const FileEncryptDecrypt = () => {

  const { state, setState } = useContext(GlobalStateContext);

  // Drag and Drop Events. MDN Ref: https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/File_drag_and_drop
  const dropHandler = async (ev: DragEvent, type: string) => {
    ev.preventDefault();
    setState({ type });
    const files = ev?.dataTransfer?.items;
    if (files?.length) {
      zip = resetZip();
      // Use DataTransferItemList interface to access the file(s)
      switch (type) {
        case ENCRYPT:
          for (let item of Array.from(files)) {
            if (item.kind === "file") {
              const file = item.getAsFile()!;
              await encryptionOperations({ file, state, setState });
              // DownloadService.downloadBlob(blob, `encrypted-${file.name}`);
            }
          }
          setState({ fileEncryptionLoader: false, keyFileUploaded: false });
          const { algorithm, IV, key } = state;
          const exportedKey = await EncryptionService.exportKeyAsJWT(key);
          downloadFiles({ algorithm, iv: String(IV).toString(), key: exportedKey });
          await zip.generateAsync({ ...ConfigService.ZIP_CONFIG, type: "base64" }).then(content => {
            window.location.href = "data:application/zip;base64," + content;
            window.alert("Files are Encrypted and downloaded.");
          });
          break;
        case DECRYPT:
          const iv: any = state.iv || state.IV;
          if (state.key && iv) {
            for (let item of Array.from(files)) {
              // If dropped items aren't files, reject them
              if (item.kind === "file") {
                const file = item.getAsFile()!;
                await decryptionOperations({ file, state, setState });
              }
            }
          }
          break;
        case KEY_FILE:
          if (files[0].kind === "file") {
            const file = files[0].getAsFile()!;
            keyFileOperations({ file, state, setState });
          }
          break;
        default:
          if (files[0].kind === "file") {}
          break;
      }
    }
  }

  const fileSelectHandler = async (ev: React.ChangeEvent<HTMLInputElement>, type: string) => {
    ev.preventDefault();
    setState({ type });
    const files = ev?.currentTarget?.files!;
    if (files?.length) {
      switch (type) {
        case ENCRYPT:
          zip = resetZip();
          for (let file of Array.from(files)) {
            await encryptionOperations({ file, state, setState });
          }
          const { algorithm, IV, key } = state;
          const exportedKey = await EncryptionService.exportKeyAsJWT(key);
          downloadFiles({ algorithm, iv: String(IV).toString(), key: exportedKey });
          zip.generateAsync({ ...ConfigService.ZIP_CONFIG, type: "base64" }).then(content => {
            window.location.href = "data:application/zip;base64," + content;
          });
          break;
        case DECRYPT:
          const iv: any = state.iv || state.IV;
          if (state.key && iv) {
            for (let file of Array.from(files)) {
              decryptionOperations({ file, state, setState });
            }
          }
          break;
        case KEY_FILE:
          const file = files[0];
          keyFileOperations({ file, state, setState });
          break;
        default:
          if (files[0].type === "file") {
          }
          break;
      }
    }
  }

  useEffect(() => {
    setState({
      fileEncryptionLoader: false,
      algorithm: null, IV: null, key: null, keyFile: null
    });
    fetchAndSetParameters();
  }, []);

  const fetchAndSetParameters = async () => {
    const { algorithm, IV, key } = await EncryptionService.generateRandomKey();
    setState({ algorithm, IV, key, keyFile: null });
  };

  return (
    <>
      {
        (!state?.type || (state?.type && state?.type === ENCRYPT)) ?
          <EncryptDecryptLanding dropHandler={dropHandler} filePickHandler={fileSelectHandler}
          /> : ''
      }
    </>
  );
};

export default FileEncryptDecrypt;

const EncryptDecryptLanding = ({ dropHandler, filePickHandler }: any) => {
  const { state, resetState } = useContext(GlobalStateContext);
  return <section className="en-decr-container">
    {
      !state?.keyFileUploaded ? (
        <div className="encrypt-file-container">
          <FileUploader
            dropHandler={dropHandler}
            filePickHandler={filePickHandler}
            type={ENCRYPT}
            message="Drag and drop or select file(s) here to start Encryption"
          />
        </div>
      ) : ''
    }
    {
      state?.keyFileUploaded ? (
        <div className="encrypt-file-container">
          <FileUploader
            dropHandler={dropHandler}
            filePickHandler={filePickHandler}
            type={DECRYPT}
            message="Drag and drop or select file(s) to start Decryption"
          />
        </div>
      ) : ''
    }
    {!state?.keyFileUploaded ? (<div className="decrypt-file-container">
      <FileUploader
        dropHandler={dropHandler}
        filePickHandler={filePickHandler}
        type={KEY_FILE}
        message="Drag and drop or select key file to start Decryption"
      />
    </div>) : ''}
    {state?.keyFileUploaded ? (<div className="go-back-container" onClick={() => { resetState() }}>
      <div className="centered">
        <label className="file-title"><h1>&larr;&ensp;Go Back</h1></label>
      </div>
    </div>) : ''}
    <section hidden className="qrcode" id="qrcode"><img id="qrcode-img" alt="" /></section>
  </section>
}
