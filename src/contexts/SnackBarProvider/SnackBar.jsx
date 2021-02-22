import React from 'react';
import PropTypes from 'prop-types';
import { Snackbar, IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import MuiAlert from '@material-ui/lab/Alert';

const SnackBar = (props) => {
  const {
    open, status, message, onClose, duration,
  } = props;
  return (
    <Snackbar open={open} autoHideDuration={duration} onClose={onClose}>
      <MuiAlert variant="filled" severity={status}>
        {message}
        <IconButton size="small" aria-label="close" color="inherit" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </MuiAlert>
    </Snackbar>
  );
};

SnackBar.propTypes = {
  duration: PropTypes.number,
  open: PropTypes.bool,
  status: PropTypes.string,
  message: PropTypes.string,
  onClose: PropTypes.func.isRequired,
};

SnackBar.defaultProps = {
  message: '',
  status: 'success',
  open: false,
  duration: 6000,
};

export default SnackBar;
