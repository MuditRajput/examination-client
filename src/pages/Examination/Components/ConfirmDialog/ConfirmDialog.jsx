import React from 'react';
import PropTypes from 'prop-types';
import {
  DialogActions, Dialog, CircularProgress,
  DialogTitle, Button,
} from '@material-ui/core';
import { useStyles } from '../../style';

const ConfirmDialog = (props) => {
  const {
    open, onClose, onSubmit, loading, text,
  } = props;
  const classes = useStyles();

  return (
    <Dialog
      open={open}
      fullWidth
      onClose={onClose}
      maxWidth="md"
    >
      <DialogTitle>
        {text}
      </DialogTitle>
      <DialogActions className={classes.margin}>
        <Button autoFocus onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={onSubmit} variant="contained" color="primary">
          Submit
          { loading && <CircularProgress />}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ConfirmDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  text: PropTypes.string,
};

ConfirmDialog.defaultProps = {
  open: false,
  loading: false,
  text: 'Confirm',
};

export default ConfirmDialog;
