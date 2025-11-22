interface GoBackButtonProps {
  onClick: () => void;
}

const GoBackButton = ({ onClick }: GoBackButtonProps) => {
  return (
    <button 
      className="go-back-container" 
      onClick={onClick}
      type="button"
      aria-label="Go back to file selection"
    >
      <div className="centered">
        <div className="file-title">
          <h2 className="go-back-heading">
            <span aria-hidden="true">&larr;</span>
            <span>Go Back</span>
          </h2>
        </div>
      </div>
    </button>
  );
};

export default GoBackButton;
