import { useEffect } from 'react';
import { useToast } from '../toast/ToastContainer';
import { useContext } from 'react';
import { GlobalStateContext } from '../../../context/GlobalStateContext';

const ErrorDisplay = () => {
  const { showToast } = useToast();
  const context = useContext(GlobalStateContext);

  useEffect(() => {
    if (context?.state?.error) {
      showToast(context.state.error, 'error');
    }
  }, [context?.state?.error, showToast]);

  return null;
};

export default ErrorDisplay;
