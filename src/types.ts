import JSZip from "jszip";

type algorithmObject = {
    name: string;
    iv: Uint8Array;
};

type KeyExportTypes = {
    algorithm: string,
    iv: string,
    key: JsonWebKey
};

type PostEncryptDecryptTypes = {
    encrytionParameters: any, 
    setEncryptionParameters: any,
    zip: JSZip
};

interface FileEncryptDecryptType {
    [key: string]: string | algorithmObject | Uint8Array | CryptoKey | boolean | null | undefined;
};

export type { algorithmObject, FileEncryptDecryptType, KeyExportTypes, PostEncryptDecryptTypes };