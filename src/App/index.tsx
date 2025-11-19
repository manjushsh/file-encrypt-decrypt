import FileEncryptDecrypt from '../features/file-encryption';
import ErrorBoundary from '../components/ErrorBoundary';
import '../css/App.css';

function App() {
  return (
    <ErrorBoundary>
      <FileEncryptDecrypt />
    </ErrorBoundary>
  );
}

export default App;
