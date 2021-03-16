import React from 'react';
import PropTypes from 'prop-types';
import {
  DialogActions, Dialog, DialogContentText, DialogContent, CircularProgress,
  DialogTitle, Button,
} from '@material-ui/core';
import { useStyles } from '../../style';

const DeleteDialog = (props) => {
  const {
    open, onClose, onDelete, loading, text,
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
      <DialogContent>
        <DialogContentText fontSize={16}>
          Do you really want to delete.
        </DialogContentText>
      </DialogContent>
      <DialogActions className={classes.margin}>
        <Button autoFocus onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={onDelete} variant="contained" color="secondary">
          Delete
          { loading && <CircularProgress />}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

DeleteDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  text: PropTypes.string,
};

DeleteDialog.defaultProps = {
  open: false,
  loading: false,
  text: 'Confirm Delete',
};

export default DeleteDialog;
