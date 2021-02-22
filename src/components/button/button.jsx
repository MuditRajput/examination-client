import React from 'react';
import PropTypes from 'prop-types';
import { Button } from './style';

const Buttons = (props) => {
  const {
    disabled, value, onClick, colored,
  } = props;
  return (
    <Button disabled={disabled} type="submit" onClick={onClick} colored={colored}>
      {value}
    </Button>
  );
};

Buttons.propTypes = {
  colored: PropTypes.bool,
  disabled: PropTypes.bool,
  value: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

Buttons.defaultProps = {
  disabled: false,
  colored: false,
};

export default Buttons;
