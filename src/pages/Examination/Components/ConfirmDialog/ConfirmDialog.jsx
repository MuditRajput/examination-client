import React from 'react';
import PropTypes from 'prop-types';
import {
  DialogActions, Dialog, CircularProgress,
  DialogTitle, Button, makeStyles,
} from '@material-ui/core';

export const useStyle = makeStyles(() => ({
  margin: {
    margin: '10px 0',
  },
}));

const ConfirmDialog = (props) => {
  const {
    open, onClose, onSubmit, loading, text,
  } = props;
  const classes = useStyle();

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
        <Button autoFocus onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={onSubmit} variant="contained" color="secondary">
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