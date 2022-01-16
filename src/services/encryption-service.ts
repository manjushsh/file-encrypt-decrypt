import { algorithmObject } from "../types";

const EncryptionService = {
    generateRandomKey: async (algorithmType = "AES-GCM") => {
        const IV = crypto.getRandomValues(new Uint8Array(12));
        const algorithm = {
            name: algorithmType,
            iv: IV,
        };
        const key = await crypto.subtle.generateKey(
            {
                name: algorithmType,
                length: 256
            }, true, ["encrypt", "decrypt"],
        );
        return { algorithm, IV, key };
    },
    encryptFileUsingAlgorithm: async (fileAsArrayBuffer: any, algorithm: algorithmObject, IV: Uint8Array, key: CryptoKey) => {
        // const { algorithm, IV, key } = await EncryptionService.generateRandomKey();
        const encryptionResult = await crypto.subtle.encrypt(algorithm, key, fileAsArrayBuffer);
        const exportedkey = await crypto.subtle.exportKey("jwk", key);
        return { blob: new Blob([encryptionResult]), iv: IV.toString(), savableKey: exportedkey }
    },
    decryptUploadedFile: async (encryptedBlobData: any, ivData: any, key: any, algorithmType = "AES-GCM") => {
        const importedKey = await crypto.subtle.importKey(
            "jwk",
            key,
            { name: algorithmType },
            true,
            ["encrypt", "decrypt"]
        );
        let IV: Uint8Array = new Uint8Array(ivData.split(','));
        const algorithm = {
            name: algorithmType,
            iv: IV,
        };
        const dataToDecrypt: ArrayBuffer = await encryptedBlobData.arrayBuffer();
        const decryptedData: ArrayBuffer = await crypto.subtle.decrypt(algorithm, importedKey, dataToDecrypt);
        return new Blob([decryptedData]);
    },
};

export default EncryptionService;