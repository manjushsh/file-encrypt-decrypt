type algorithmObject = {
    name: string;
    iv: Uint8Array;
};

interface FileEncryptDecryptType {
    [key: string]: string | algorithmObject | Uint8Array | CryptoKey | null | undefined;
};

export type { algorithmObject, FileEncryptDecryptType };