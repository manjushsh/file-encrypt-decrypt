import { useEffect, useState } from "react";
import JSZip from 'jszip';
import DownloadService from "../../services/download-service";
import EncryptionService from "../../services/encryption-service";
import { FileEncryptDecryptType, KeyExportTypes, PostEncryptDecryptTypes } from "../../types";
import BarLoader from "../common/loader";
import ConfigService from "../../services/config-service";
import "../../css/index.css";
import "../../css/file-encrypt-decrypt.css";
// @ts-ignore
// import QrCode from 'qrcode-reader'

declare global {
  interface Window {
    QRCode: any;
  }
}
const { QRCode } = window;
// const scanImageQR = async (imageFile: File) => {
//   const base64 = await DownloadService.fileToBase64(imageFile);
//   const qr = new QrCode();
//   // const imageNode = document.getElementById("qrcode-img");
//   const code = await qr.decode(base64);
//   console.warn(code);
//   // Scan QR Code

// };

const getNewQRCodeObject = () => {
  const name = "qrcode";
  return new QRCode(name, {
    ...ConfigService.QR_CODE_CONFIG,
    correctLevel: QRCode.CorrectLevel.H,
  });
};

const commonFileOperations = async (file: any) => {
  const blobOfFile: Blob = new Blob([file]);
  const arrayBuffer: ArrayBuffer = await blobOfFile.arrayBuffer();
  return arrayBuffer;
};

const downloadEncryptionFiles = ({ algorithm, iv, key }: KeyExportTypes) => {
  const JSONToExport = JSON.stringify({ algorithm, iv, key: key });
  const QR_CODE = getNewQRCodeObject();
  QR_CODE.makeCode(JSONToExport);
  const dataUrl = document.getElementById('qrcode')?.querySelector('canvas')?.toDataURL() || '';
  const dateNow = Date.now();
  DownloadService.downloadURI(dataUrl, `qrcode-key-${dateNow}`);
  const JSONBlob: Blob = new Blob([JSONToExport], { type: "application/json" });
  DownloadService.downloadBlob(JSONBlob, `key-${dateNow}.json`);
}

const encryptionOperations = async ({ file, encrytionParameters, zip }: any) => {
  const { algorithm, IV, key } = encrytionParameters;
  const arrayBuffer: ArrayBuffer = await commonFileOperations(file);
  const { blob } = await EncryptionService.encryptFileUsingAlgorithm(arrayBuffer, algorithm, IV, key);
  zip.file(file.name, blob);
};

const postEncryptionOperations = async ({ encrytionParameters, setEncryptionParameters, zip }: PostEncryptDecryptTypes) => {
  setEncryptionParameters({ ...encrytionParameters, fileEncryptionLoader: false, keyFileUploaded: false });
  const { algorithm, IV, key } = encrytionParameters;
  const exportedKey = await EncryptionService.exportKeyAsJWT(key);
  downloadEncryptionFiles({ algorithm, iv: String(IV).toString(), key: exportedKey });
  zip.generateAsync({type: "base64", compression: "DEFLATE"}).then(content => {
    window.location.href = "data:application/zip;base64," + content;
  });
}

const decryptionOperations = async ({ file, iv, encrytionParameters, zip }: any) => {
  const arrayBuffer: ArrayBuffer = await commonFileOperations(file);
  const blob = await EncryptionService.decryptUploadedFile(arrayBuffer, iv, encrytionParameters.key);
  const fileName = file?.name?.startsWith("encrypted") ? file.name.replace(/encrypted-/i, "") : file.name;
  zip.file(fileName, blob);
  return zip;
  // DownloadService.downloadBlob(blob, `${fileName}`);
}

const postDecryptionOperations = async ({ encrytionParameters, setEncryptionParameters, zip }: PostEncryptDecryptTypes) => {
  setEncryptionParameters({ ...encrytionParameters, fileEncryptionLoader: false, keyFileUploaded: false });
  await zip.generateAsync({type: "base64", compression: "DEFLATE"}).then(content => {
    window.location.href = "data:application/zip;base64," + content;
  });
}

const pickFile = ({ isMulti = true, acceptTypes = "*", type = 'encrypt', encrytionParameters, setEncryptionParameters }: any) => {
  const input = document.createElement('input');
  input.type = 'file';
  input.multiple = isMulti;
  input.accept = acceptTypes;
  input.onchange = async (e) => {
    const zip = new JSZip();
    e.preventDefault();
    // getting a hold of the file reference
    const files = Array.from((e.target as HTMLInputElement)?.files!);
    if (files && files.length > 0) {
      switch (type) {
        case "encrypt":
          setEncryptionParameters({ ...encrytionParameters, fileEncryptionLoader: true, });
          files.forEach(async (file) => {
            await encryptionOperations({ file, encrytionParameters, zip });
          });
          await postEncryptionOperations({ encrytionParameters, setEncryptionParameters, zip });
          break;
        case "decrypt":
          const iv: any = encrytionParameters.iv || encrytionParameters.IV;
          setEncryptionParameters({ ...encrytionParameters, fileEncryptionLoader: true });
          files.forEach(async (file) => {
            await decryptionOperations({ file, iv, encrytionParameters, zip });
          });
          await postDecryptionOperations({ encrytionParameters, setEncryptionParameters, zip });
          break;
      }
    }
  }
  input.click();
};

// Drag and Drop Events. MDN Ref: https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/File_drag_and_drop
const dropHandler = async (ev: any, type: string, encrytionParameters: any, setEncryptionParameters: any) => {
  ev.preventDefault();
  if (ev.dataTransfer.items) {
    const zip = new JSZip();
    // Use DataTransferItemList interface to access the file(s)
    switch (type) {
      case "encrypt":
        if (ev?.dataTransfer?.items) {
          setEncryptionParameters({ ...encrytionParameters, fileEncryptionLoader: true, });
          for (let i = 0; i < ev.dataTransfer.items.length; i++) {
            // If dropped items aren't files, reject them
            if (ev.dataTransfer.items[i].kind === "file") {
              const file = ev.dataTransfer.items[i].getAsFile();
              await encryptionOperations({ file, encrytionParameters, setEncryptionParameters, zip });
            }
          }
        }
        await postEncryptionOperations({ encrytionParameters, setEncryptionParameters, zip });
        break;
      case "decrypt":
        // setEncryptionParameters({ algorithm: null, IV: null, key: null, });
        const iv: any = encrytionParameters.iv || encrytionParameters.IV;
        if (encrytionParameters.key && iv) {
          setEncryptionParameters({ ...encrytionParameters, fileEncryptionLoader: true });
          for (let i = 0; i < ev.dataTransfer.items.length; i++) {
            // If dropped items aren't files, reject them
            if (ev.dataTransfer.items[i].kind === "file") {
              const file = ev.dataTransfer.items[i].getAsFile();
              await decryptionOperations({ file, iv, encrytionParameters, setEncryptionParameters, zip });
            }
          }
          await postDecryptionOperations({ encrytionParameters, setEncryptionParameters, zip });
        }
        break;
      case "key-file":
        if (ev.dataTransfer.items[0].kind === "file") {
          const file = ev.dataTransfer.items[0].getAsFile();
          if (file.type === "application/json") {
            const data: any = await EncryptionService.fileToJSON(file);
            const keyFile = JSON.parse(data);
            if (keyFile.iv && keyFile.key)
              setEncryptionParameters({ ...keyFile, keyFileUploaded: true });
            else alert("Uploaded JSON is not an valid key file!");
          }
          // else if (file.type === "image/png") {
          //   // const base64 = await DownloadService.fileToBase64(file);
          //   const image = document.getElementById("qrcode-img")! as HTMLImageElement;
          //   image.src = URL.createObjectURL(file);
          //   const decodedQRData = await scanImageQR(file);
          //   console.warn("file ", decodedQRData);

          // }
          else {
            alert(
              "Uploaded file is not a valid key file. Please check file and reupload again. It should be an JSON file"
            );
          }
        }
        break;
      default:
        if (ev.dataTransfer.items[0].kind === "file") {
          const file = ev.dataTransfer.items[0].getAsFile();
          console.log("Key: " + file.name);
        }
        break;
    }
  } else {
    // Use DataTransfer interface to access the file(s)
    for (let i = 0; i < ev.dataTransfer.files.length; i++) {
      console.log("... file[" + i + "].name = " + ev.dataTransfer.files[i].name);
    }
  }
};

const dragOverHandler = (ev: any) => ev.preventDefault();

const FileEncryptDecrypt = () => {
  const defaultState: FileEncryptDecryptType = {
    fileEncryptionLoader: false,
    fileDecryptionLoader: false,
  };
  const [encrytionParameters, setEncryptionParameters] = useState(defaultState);
  useEffect(() => {
    fetchAndSetParameters();
  }, []);

  const fetchAndSetParameters = async () => {
    const { algorithm, IV, key } = await EncryptionService.generateRandomKey();
    setEncryptionParameters({ algorithm, IV, key, keyFile: null });
  };

  return (
    <>
      <div className="file-ed-container dark">
        {!encrytionParameters?.keyFileUploaded ? (
          <section className="file-input encrypt">
            <div
              id="drop_zone"
              className="encrypt"
              onDrop={(e) => {
                e.preventDefault();
                dropHandler(e, "encrypt", encrytionParameters, setEncryptionParameters);
              }}
              onDragOver={dragOverHandler}
              onClick={() => pickFile({ isMulti: true, encrytionParameters, setEncryptionParameters })}
            >
              {!encrytionParameters.fileEncryptionLoader ? (
                <p className="file-title">
                  {"Drag and drop a file here start Encryption ..."}
                </p>
              ) : (
                <BarLoader />
              )}
            </div>
          </section>
        ) : (
          ""
        )}
        <section className="file-input">
          {encrytionParameters?.keyFileUploaded ? (
            <div
              id="drop_zone"
              className="decrypt"
              onDrop={(e) => {
                e.preventDefault();
                dropHandler(e, "decrypt", encrytionParameters, setEncryptionParameters);
              }}
              onDragOver={dragOverHandler}
            >
              <p className="file-title">
                {"Drag and drop a file here start Decryption ..."}
              </p>
            </div>
          ) : (
            ""
          )}

          <div
            id="drop_zone"
            className="key-file"
            onDrop={(e) => {
              e.preventDefault();
              dropHandler(
                e,
                "key-file",
                encrytionParameters,
                setEncryptionParameters
              );
            }}
            onDragOver={dragOverHandler}
          >
            <p className="file-title">
              {encrytionParameters?.keyFileUploaded
                ? "Key Uploaded. Upload encrypted file in decryption section."
                : "Drop key file here to initiate Decryption menu.."}
            </p>
          </div>
        </section>
        <section className="qrcode" id="qrcode"><img id="qrcode-img" alt="" /></section>
      </div>
    </>
  );
};

export default FileEncryptDecrypt;
