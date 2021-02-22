/* eslint-disable no-shadow */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Container, Typography, Button, TextField, InputAdornment, makeStyles, CircularProgress,
} from '@material-ui/core';
import EmailIcon from '@material-ui/icons/Email';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import { useMutation } from '@apollo/client';
import * as yup from 'yup';
// import { callApi } from '../../lib/utils';
import { SnackbarContext } from '../../contexts';
import { LOGIN_USER } from './mutation';

export const useStyle = makeStyles((theme) => ({
  flexcolumnCenter: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '40px 30px',
    borderRadius: '4px',
    border: '1px solid silver',
    marginTop: theme.spacing(10),
    boxSizing: 'border-box',
  },
  iconRound: {
    padding: '4px',
    borderRadius: '50%',
    background: theme.palette.secondary.main,
    color: 'white',
    margin: '20px',
  },
  buttonLogin: {
    marginTop: '25px',
  },
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
}));

const LoginUi = (props) => {
  const { history } = props;
  const classes = useStyle();
  const schema = yup.object().shape({
    email: yup.string().required('Email is required').email(),
    password: yup.string().required('Password is required').matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, 'Password must contain at least 8 characters with at least one uppercase, one lowercase, one number, one special character'),
  });

  const [state, setstate] = useState({
    email: '', password: '',
  });
  const [loginUser] = useMutation(LOGIN_USER);
  const [onBlur, setBlur] = useState({});

  const [loading, setLoading] = useState(false);

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

  const handleCallApi = async (openSnackbar) => {
    const { email, password } = state;
    try {
      const response = await loginUser({ variables: { email, password } });
      console.log(response);
      const { data: { loginUser: { data, status, message } = {} } = {} } = response;
      if (data) {
        openSnackbar(status, message);
        localStorage.setItem('token', data.token);
        history.push('/');
      } else {
        setLoading(false);
        openSnackbar('error', message);
      }
    } catch (err) {
      setLoading(false);
      openSnackbar('error', 'Something Went Wrong');
    }
  };

  const hangleLogin = (openSnackbar) => {
    setLoading(true);
    console.log(state);
    handleCallApi(openSnackbar);
  };

  return (
    <SnackbarContext.Consumer>
      {({ openSnackbar }) => (
        <Container
          maxWidth="xs"
        >
          <div className={classes.flexcolumnCenter}>
            <LockOutlinedIcon className={classes.iconRound} />
            <Typography variant="h5">
              Login
            </Typography>
            <form>
              <TextField
                required
                fullWidth
                size="small"
                margin="normal"
                error={!!getError('email')}
                helperText={getError('email')}
                onChange={(input) => handleInputField('email', input)}
                onBlur={() => handleBlur('email')}
                label="Email"
                InputProps={{
                  startAdornment: <InputAdornment position="start"><EmailIcon style={{ fontSize: 20 }} opacity="0.6" /></InputAdornment>,
                }}
                variant="outlined"
              />
              <TextField
                required
                fullWidth
                margin="normal"
                size="small"
                type="password"
                error={!!getError('password')}
                helperText={getError('password')}
                onChange={(input) => handleInputField('password', input)}
                onBlur={() => handleBlur('password')}
                label="Password"
                InputProps={{
                  startAdornment: <InputAdornment position="start"><VisibilityOffIcon style={{ fontSize: 20 }} opacity="0.6" /></InputAdornment>,
                }}
                variant="outlined"
              />
              <Button className={classes.buttonLogin} fullWidth disabled={hasErrors() || !isTouched() || loading} onClick={() => hangleLogin(openSnackbar)} color="primary" variant="contained">
                Login
                { loading && <CircularProgress size={24} className={classes.buttonProgress} /> }
              </Button>
            </form>
          </div>
        </Container>
      )}
    </SnackbarContext.Consumer>

  );
};

LoginUi.propTypes = {
  history: PropTypes.object.isRequired,
};

export default LoginUi;
