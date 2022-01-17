import { useEffect, useState } from 'react';
import '../../css/file-encrypt-decrypt.css';
import DownloadService from '../../services/download-service';
import EncryptionService from '../../services/encryption-service';

const commonFileOperations = async (file: any) => {
    const blobOfFile: Blob = new Blob([file]);
    const arrayBuffer: ArrayBuffer = await blobOfFile.arrayBuffer();
    return arrayBuffer;
}

// Drag and Drop Events. MDN Ref: https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/File_drag_and_drop
const dropHandler = async (ev: any, type: string, encrytionParameters: any, setEncryptionParameters: any) => {
    ev.preventDefault();
    if (ev.dataTransfer.items) {
        // Use DataTransferItemList interface to access the file(s)
        switch (type) {
            case 'encrypt':
                const { algorithm, IV, key } = encrytionParameters;
                for (let i = 0; i < ev.dataTransfer.items.length; i++) {
                    // If dropped items aren't files, reject them
                    if (ev.dataTransfer.items[i].kind === 'file') {
                        const file = ev.dataTransfer.items[i].getAsFile();
                        const arrayBuffer: ArrayBuffer = await commonFileOperations(file);
                        const { blob, iv, savableKey } = await EncryptionService.encryptFileUsingAlgorithm(arrayBuffer, algorithm, IV, key);
                        const JSONBlob: Blob = new Blob([JSON.stringify({ iv, key: savableKey })], {
                            type: 'application/json'
                        });
                        DownloadService.downloadBlob(JSONBlob, `key-${file.name}.json`);
                        DownloadService.downloadBlob(blob, `encrypted-${file.name}`);
                    }
                }
                break;
            case 'decrypt':
                // setEncryptionParameters({ algorithm: null, IV: null, key: null, });
                const iv: any = encrytionParameters.iv || encrytionParameters.IV;
                if (encrytionParameters.key && (iv)) {
                    for (let i = 0; i < ev.dataTransfer.items.length; i++) {
                        // If dropped items aren't files, reject them
                        if (ev.dataTransfer.items[i].kind === 'file') {
                            const file = ev.dataTransfer.items[i].getAsFile();
                            const arrayBuffer: ArrayBuffer = await commonFileOperations(file);
                            const blob = await EncryptionService.decryptUploadedFile(arrayBuffer, iv, encrytionParameters.key);
                            DownloadService.downloadBlob(blob, `decrypted-${file.name}`);
                        }
                    }
                }
                break;
            case 'key-file':
                if (ev.dataTransfer.items[0].kind === 'file') {
                    const file = ev.dataTransfer.items[0].getAsFile();
                    const data: any = await EncryptionService.fileToJSON(file);
                    const keyFile = JSON.parse(data);
                    setEncryptionParameters({ ...keyFile });
                }
                break;
            default:
                if (ev.dataTransfer.items[0].kind === 'file') {
                    const file = ev.dataTransfer.items[0].getAsFile();
                    console.log('Key: ' + file.name);
                }
                break;
        }
    } else {
        // Use DataTransfer interface to access the file(s)
        for (let i = 0; i < ev.dataTransfer.files.length; i++) {
            console.log('... file[' + i + '].name = ' + ev.dataTransfer.files[i].name);
        }
    }
}

const dragOverHandler = (ev: any) => ev.preventDefault();

const FileEncryptDecrypt = () => {
    const [encrytionParameters, setEncryptionParameters] = useState({});
    useEffect(() => { fetchAndSetParameters() }, []);

    const fetchAndSetParameters = async () => {
        const { algorithm, IV, key } = await EncryptionService.generateRandomKey();
        setEncryptionParameters({ algorithm, IV, key, keyFile: null, });
    }

    return (
        <>
            <div className="container">
                <section className="file-input encrypt">
                    <div id="drop_zone" className='encrypt' onDrop={e => {
                        e.preventDefault();
                        dropHandler(e, 'encrypt', encrytionParameters, setEncryptionParameters);
                    }} onDragOver={dragOverHandler}>
                        <p>Drag one or more files Start Encryption ...</p>
                    </div>
                </section>
                <section className='file-input decrypt'>
                    <div id="drop_zone" className='decrypt' onDrop={e => {
                        e.preventDefault();
                        dropHandler(e, 'decrypt', encrytionParameters, setEncryptionParameters);
                    }} onDragOver={dragOverHandler}>
                        <p>Drag one or more files and a key file to Start Decrytion ...</p>
                    </div>

                    <div id="drop_zone" className='decrypt' onDrop={e => {
                        e.preventDefault();
                        dropHandler(e, 'key-file', encrytionParameters, setEncryptionParameters);
                    }} onDragOver={dragOverHandler}>
                        <p>Drop key file here..</p>
                    </div>
                </section>
            </div>
        </>
    )
};

export default FileEncryptDecrypt;
