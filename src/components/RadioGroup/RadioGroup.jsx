import React from 'react';
import PropTypes from 'prop-types';
import { P } from './style';

const RadioGroup = (props) => {
  const {
    error, onChange, options, value: selectedValue, onBlur,
  } = props;
  return (
    <>
      {
        options.map(({ value, label }) => (
          <div key={label}>
            <input type="radio" checked={selectedValue === value} id={label} value={value} onChange={onChange} error={error} onBlur={onBlur} />
            {label}
          </div>
        ))
      }
      <P>{error}</P>
    </>
  );
};

RadioGroup.propTypes = {
  value: PropTypes.string,
  error: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.array,
  onBlur: PropTypes.func.isRequired,
};

RadioGroup.defaultProps = {
  error: '',
  value: '',
  options: [],
};

export default RadioGroup;
