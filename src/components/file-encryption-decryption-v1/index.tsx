import { Activity, useContext, useEffect } from "react";
import { ENCRYPT, GlobalStateContext } from "../../context/GlobalStateContext";
import EncryptionService from "../../services/encryption-service";
import EncryptDecryptLanding from "./EncryptDecryptLanding";
import { useFileHandlers } from "./useFileHandlers";
import './styles.css';
import "../../css/index.css";
import { ActivityStates } from "../../services/config-service";

const FileEncryptDecrypt = () => {
  const { state, setState } = useContext(GlobalStateContext);
  const { dropHandler, fileSelectHandler } = useFileHandlers();

  useEffect(() => {
    setState({
      fileEncryptionLoader: false,
      algorithm: null,
      IV: null,
      key: null,
      keyFile: null
    });
    fetchAndSetParameters();
  }, []);

  const fetchAndSetParameters = async () => {
    const { algorithm, IV, key } = await EncryptionService.generateRandomKey();
    setState({ algorithm, IV, key, keyFile: null });
  };

  return (
    < Activity mode={!state?.type || (state?.type && state?.type === ENCRYPT) ? ActivityStates.VISIBLE : ActivityStates.HIDDEN} >
        <EncryptDecryptLanding
          dropHandler={dropHandler}
          filePickHandler={fileSelectHandler}
        />
    </Activity>
  );
};

export default FileEncryptDecrypt;
