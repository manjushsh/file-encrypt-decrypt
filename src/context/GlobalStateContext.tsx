// ** React Imports
import { createContext, useState, ReactNode } from 'react'
import EncryptionService from '../services/encryption-service';

// ** Types
import { DynamicObject } from './types'

// ** Defaults
const defaultProvider: DynamicObject = {};

const GlobalStateContext = createContext(defaultProvider)

type Props = {
  children: ReactNode
}

const GlobalStateProvider = ({ children }: Props) => {

  // ** States
  const [state, updateState] = useState<DynamicObject>({})
  const setState = (payload: DynamicObject) => updateState({ ...state, ...payload });
  const resetState = () => {
    window.location.reload();
    updateState({});
    EncryptionService.generateRandomKey()
      .then(data => {
        updateState({ ...data });
      })
      .catch(err => {
        updateState({ error: `Oops! Error: ${err?.message}` });
        console.error('Encryption service error:', err);
      });
  };

  const values = {
    state,
    setState,
    resetState,
  }

  return <GlobalStateContext.Provider value={values}>{children}</GlobalStateContext.Provider>
}

export { GlobalStateContext, GlobalStateProvider }

export const ENCRYPT = 'encrypt';
export const DECRYPT = 'decrypt';
export const KEY_FILE = 'key-file'
