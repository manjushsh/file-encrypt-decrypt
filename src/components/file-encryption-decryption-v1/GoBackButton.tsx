interface GoBackButtonProps {
  onClick: () => void;
}

const GoBackButton = ({ onClick }: GoBackButtonProps) => {
  return (
    <div className="go-back-container" onClick={onClick}>
      <div className="centered">
        <label className="file-title">
          <h1>&larr;&ensp;Go Back</h1>
        </label>
      </div>
    </div>
  );
};

export default GoBackButton;
