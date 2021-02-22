import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';
import * as jwt from 'jsonwebtoken';
import { makeStyles } from '@material-ui/core';
import { PrivateLayout } from '../layouts';
import { SnackbarContext } from '../contexts';

const useStyles = makeStyles((theme) => ({
  navBody: {
    margin: theme.spacing(2),
  },
}));

const PrivateRoute = ({ component: Component, ...rest }) => {
  const classes = useStyles();
  const token = localStorage.getItem('token');
  const secretKey = process.env.REACT_APP_SECRET_KEY;
  let flag = false;
  try {
    if (token) {
      jwt.verify(token, secretKey);
    }
    flag = false;
  } catch {
    flag = true;
  }
  if (!localStorage.getItem('token') || flag) {
    return (
      <SnackbarContext.Consumer>
        {({ openSnackbar }) => {
          if (flag) {
            openSnackbar('info', 'Session Expired');
          }
          return (
            <Redirect path="/" to="/login" />
          );
        }}
      </SnackbarContext.Consumer>
    );
  }
  return (
    <Route
      {...rest}
      render={(matchProps) => (
        <PrivateLayout>
          <div className={classes.navBody}>
            <Component {...matchProps} />
          </div>
        </PrivateLayout>
      )}
    />
  );
};

PrivateRoute.propTypes = {
  component: PropTypes.func.isRequired,
};

export default PrivateRoute;
