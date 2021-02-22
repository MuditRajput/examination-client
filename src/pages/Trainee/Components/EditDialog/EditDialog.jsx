import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  DialogActions, Dialog, DialogContentText, DialogContent, CircularProgress,
  DialogTitle, Button, TextField, InputAdornment, makeStyles,
} from '@material-ui/core';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import EmailIcon from '@material-ui/icons/Email';
import * as yup from 'yup';

export const useStyle = makeStyles(() => ({
  margin: {
    margin: '10px 0',
  },
}));

const EditDialog = (props) => {
  const {
    open, onClose, onSubmit, defaultValues, loading,
  } = props;
  const { email, name } = defaultValues;
  const classes = useStyle();
  const [state, setstate] = useState({
    name: '', email: '',
  });
  const [onBlur, setBlur] = useState({});
  const [schemaErrors, setSchemaErrors] = useState({});

  const schema = yup.object().shape({
    name: yup.string().required('Name is required').min(3, 'should have more then 3 characters'),
    email: yup.string().required('Email is required').email(),
  });

  const handleErrors = (errors) => {
    const schemaError = {};
    if (Object.keys(errors).length) {
      errors.inner.forEach((error) => {
        schemaError[error.path] = error.message;
      });
    }
    setSchemaErrors(schemaError);
  };

  const handleValidate = () => {
    schema.validate(state, { abortEarly: false })
      .then(() => { handleErrors({}); })
      .catch((err) => { handleErrors(err); });
  };

  const handleBlur = (label) => {
    setBlur({ ...onBlur, [label]: true });
  };

  const getError = (label) => {
    if (onBlur[label]) {
      return schemaErrors[label] || '';
    }
    return '';
  };

  useEffect(() => {
    handleValidate();
  }, [state]);

  const hasErrors = () => Object.keys(schemaErrors).length !== 0;

  const isTouched = () => Object.keys(onBlur).length !== 0;

  const handleInputField = (label, input) => {
    setstate({
      ...state, [label]: input.target.value,
    });
  };

  const handleClose = () => {
    setBlur({});
    onClose();
  };

  const handleSubmit = (details) => {
    onSubmit(details);
    setstate({
      name: '', email: '',
    });
    setBlur({});
  };

  return (
    <Dialog
      open={open}
      fullWidth
      onClose={onClose}
      maxWidth="md"
    >
      <DialogTitle>
        Edit Trainee
      </DialogTitle>
      <DialogContent>
        <DialogContentText fontSize={16}>
          Edit Your New Details
        </DialogContentText>
        <TextField
          required
          fullWidth
          error={!!getError('name')}
          helperText={getError('name')}
          className={classes.margin}
          defaultValue={name}
          onChange={(input) => handleInputField('name', input)}
          onBlur={() => handleBlur('name')}
          label="Name"
          id="outlined-start-adornment"
          InputProps={{
            startAdornment: <InputAdornment position="start"><AccountCircleIcon opacity="0.6" /></InputAdornment>,
          }}
          variant="outlined"
        />
        <TextField
          required
          fullWidth
          error={!!getError('email')}
          helperText={getError('email')}
          className={classes.margin}
          defaultValue={email}
          onChange={(input) => handleInputField('email', input)}
          onBlur={() => handleBlur('email')}
          label="Email"
          InputProps={{
            startAdornment: <InputAdornment position="start"><EmailIcon opacity="0.6" /></InputAdornment>,
          }}
          variant="outlined"
        />
      </DialogContent>
      <DialogActions className={classes.margin}>
        <Button autoFocus onClick={handleClose} color="secondary">
          Cancel
        </Button>
        <Button disabled={hasErrors() || !isTouched()} onClick={() => handleSubmit(state)} color="primary">
          Submit
          { loading && <CircularProgress />}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

EditDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  defaultValues: PropTypes.object,
  loading: PropTypes.bool,
};

EditDialog.defaultProps = {
  open: false,
  defaultValues: {},
  loading: false,
};

export default EditDialog;
