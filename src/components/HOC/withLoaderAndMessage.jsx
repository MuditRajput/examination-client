import React from 'react';
import PropTypes from 'prop-types';
import { CircularProgress, Typography } from '@material-ui/core';

const withLoaderAndMessage = (WrappedComponent) => {
  const WithLoaderAndMessage = (props) => {
    const {
      loader, dataLength, message, ...rest
    } = props;
    if (loader) {
      return (
        <Typography component="div" align="center">
          <CircularProgress size={24} />
        </Typography>
      );
    }
    if (!dataLength) {
      return (
        <Typography align="center" variant="h3">{message}</Typography>
      );
    }
    return (
      <WrappedComponent {...rest} />
    );
  };

  WithLoaderAndMessage.propTypes = {
    loader: PropTypes.bool,
    dataLength: PropTypes.number,
    message: PropTypes.string,
  };

  WithLoaderAndMessage.defaultProps = {
    loader: false,
    dataLength: 0,
    message: 'No Data to display',
  };

  return WithLoaderAndMessage;
};

export default withLoaderAndMessage;
