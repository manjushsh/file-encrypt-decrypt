import FileEncryptDecrypt from '../components/file-encryption-decryption-v1';
import { ThemeProvider } from '../context/ThemeContext';
import { ToastProvider } from '../components/common/toast/ToastContainer';
import '../css/App.css';

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <FileEncryptDecrypt />
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
