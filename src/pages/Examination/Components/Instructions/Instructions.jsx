import React from 'react';
import PropTypes from 'prop-types';
import {
  DialogActions, Dialog, DialogTitle, Button, DialogContent, Typography,
} from '@material-ui/core';
import { instructions } from '../../../../configs/Constants';

const Instructions = (props) => {
  const {
    open, onClose, onSubmit,
  } = props;

  return (
    <Dialog
      open={open}
      fullWidth
      onClose={onClose}
      maxWidth="md"
    >
      <DialogTitle>
        Instructions
      </DialogTitle>
      <DialogContent>
        <Typography>
          READ ALL INSTRUCTIONS CAREFULLY BEFORE ATTEMPTING :
        </Typography>
        <ol>
          {
            instructions.map((instruction) => (
              <li key={instruction}>{instruction}</li>
            ))
          }
        </ol>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={onSubmit} variant="contained" color="primary">
          Take test
        </Button>
      </DialogActions>
    </Dialog>
  );
};

Instructions.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

Instructions.defaultProps = {
  open: false,
};

export default Instructions;
