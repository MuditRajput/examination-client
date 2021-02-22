import React from 'react';
import PropTypes from 'prop-types';
import SnackBar from './SnackBar';

export const SnackbarContext = React.createContext();

const SnackBarProvider = (props) => {
  const { children } = props;
  const [snackValues, setSnackValues] = React.useState({
    status: '', message: '', open: false,
  });

  const openSnackBar = (status, message) => {
    setSnackValues({
      status,
      message,
      open: true,
    });
  };

  const snackBarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackValues({ open: false });
  };

  return (
    <>
      <SnackbarContext.Provider
        value={{
          openSnackbar: openSnackBar,
        }}
      >
        {children}
        <SnackBar
          duration={3000}
          open={snackValues.open}
          onClose={snackBarClose}
          message={snackValues.message}
          status={snackValues.status}
        />
      </SnackbarContext.Provider>
    </>
  );
};

SnackBarProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default SnackBarProvider;
