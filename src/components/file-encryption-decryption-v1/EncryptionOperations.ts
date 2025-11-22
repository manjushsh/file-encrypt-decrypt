import JSZip from 'jszip';
import EncryptionService from '../../services/encryption-service';
import { commonFileOperations } from './functions';

let zip = new JSZip();

export const resetZip = () => {
  zip.forEach(item => zip.remove(item));
  zip = new JSZip();
  return zip;
};

export const getZip = () => zip;

export const setZip = (newZip: JSZip) => {
  zip = newZip;
};

export const encryptionOperations = async ({ file, state, setState }: any) => {
  const { algorithm, IV, key } = state;
  const arrayBuffer: ArrayBuffer = await commonFileOperations(file);
  setState({ fileEncryptionLoader: true });
  const { blob } = await EncryptionService.encryptFileUsingAlgorithm(arrayBuffer, algorithm, IV, key);
  zip = zip.file(`encrypted-${file.name}`, blob);
};
