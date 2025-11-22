import './style.css';

const BarLoader = () => (
  <div 
    className='loader' 
    role="status" 
    aria-live="polite" 
    aria-label="Processing files"
  >
    <span className="sr-only">Loading...</span>
  </div>
);

export default BarLoader;