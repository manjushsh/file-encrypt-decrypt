type algorithmObject = {
    name: string;
    iv: Uint8Array;
};

type KeyExportTypes = { 
    algorithm: string, 
    iv: string, 
    key: JsonWebKey
};

interface FileEncryptDecryptType {
    [key: string]: string | algorithmObject | Uint8Array | CryptoKey | boolean | null | undefined;
};

export type { algorithmObject, FileEncryptDecryptType, KeyExportTypes };