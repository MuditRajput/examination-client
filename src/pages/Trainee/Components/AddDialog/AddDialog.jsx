import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  DialogActions, Dialog, DialogContentText, DialogContent, CircularProgress,
  DialogTitle, Button, TextField, InputAdornment, makeStyles,
} from '@material-ui/core';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import EmailIcon from '@material-ui/icons/Email';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import * as yup from 'yup';

export const useStyle = makeStyles(() => ({
  margin: {
    margin: '10px 0',
  },
  flexRow: {
    display: 'flex',
    alignContent: 'space-between',
    margin: '10px 0',
  },
  flexElements: {
    marginLeft: '15px',
  },
}));

const TraineeComponent = (props) => {
  const {
    open, onClose, onSubmit, loading,
  } = props;
  const classes = useStyle();
  const schema = yup.object().shape({
    name: yup.string().required('Name is required').min(3, 'should have more then 3 characters'),
    email: yup.string().required('Email is required').email(),
    password: yup.string().required('Password is required').matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, 'Password must contain at least 8 characters with at least one uppercase, one lowercase, one number, one special character'),
    confirm: yup.string().required('Required').oneOf([yup.ref('password'), ''], 'Confirm Password is different'),
  });

  const [state, setstate] = useState({
    name: '', email: '', password: '', confirm: '',
  });

  const [onBlur, setBlur] = useState({});

  const [schemaErrors, setSchemaErrors] = useState({});

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

  const handleOnSubmit = () => {
    onSubmit(state);
    setstate({
      name: '', email: '', password: '', confirm: '',
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
        Add Trainee
      </DialogTitle>
      <DialogContent>
        <DialogContentText fontSize={16}>
          Enter Your Trainee Details
        </DialogContentText>
        <TextField
          required
          fullWidth
          error={!!getError('name')}
          helperText={getError('name')}
          className={classes.margin}
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
          onChange={(input) => handleInputField('email', input)}
          onBlur={() => handleBlur('email')}
          label="Email"
          InputProps={{
            startAdornment: <InputAdornment position="start"><EmailIcon opacity="0.6" /></InputAdornment>,
          }}
          variant="outlined"
        />
        <div className={classes.flexRow}>
          <TextField
            required
            fullWidth
            type="password"
            error={!!getError('password')}
            helperText={getError('password')}
            onChange={(input) => handleInputField('password', input)}
            onBlur={() => handleBlur('password')}
            label="Password"
            InputProps={{
              startAdornment: <InputAdornment position="start"><VisibilityOffIcon opacity="0.6" /></InputAdornment>,
            }}
            variant="outlined"
          />
          <TextField
            required
            fullWidth
            type="password"
            error={!!getError('confirm')}
            helperText={getError('confirm')}
            className={classes.flexElements}
            onChange={(input) => handleInputField('confirm', input)}
            onBlur={() => handleBlur('confirm')}
            label="Confirm Password"
            InputProps={{
              startAdornment: <InputAdornment position="start"><VisibilityOffIcon opacity="0.6" /></InputAdornment>,
            }}
            variant="outlined"
          />
        </div>
      </DialogContent>
      <DialogActions className={classes.margin}>
        <Button autoFocus onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button disabled={hasErrors() || !isTouched() || loading} onClick={() => handleOnSubmit(state)} color="primary">
          Submit
          { loading && <CircularProgress />}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

TraineeComponent.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

TraineeComponent.defaultProps = {
  open: false,
  loading: false,
};

export default TraineeComponent;
