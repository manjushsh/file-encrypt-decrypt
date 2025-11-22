import './style.css';

const Header = () => {
  return (
    <header className="app-header" role="banner">
      <div className="header-content">
        <div className="logo-section">
          <svg 
            className="logo-icon" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            <circle cx="12" cy="16" r="1" fill="currentColor"></circle>
          </svg>
          <h1 className="app-title">SecureFiles</h1>
        </div>
        <p className="app-subtitle" role="doc-subtitle">Encrypt and decrypt your files securely in your browser</p>
      </div>
    </header>
  );
};

export default Header;
