import './style.css';

const Footer = () => {
  return (
    <footer className="app-footer" role="contentinfo">
      <div className="footer-content">
        <div className="footer-info" role="note" aria-label="Privacy information">
          <svg 
            className="info-icon" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            aria-hidden="true"
            role="img"
            aria-label="Information icon"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
          <p>All encryption happens locally in your browser. Your files never leave your device.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
