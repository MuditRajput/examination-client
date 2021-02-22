import React from 'react';
import PropTypes from 'prop-types';

const getResult = (first, second, operator) => {
  let result;
  if (!['+', '-', '*', '/'].includes(operator)) {
    result = 'invalid operation';
  } else {
    result = eval(`${first} ${operator} ${second}`);
  }
  return result;
};

const MathFunction = (props) => {
  const {
    first, second, operator, children,
  } = props;
  if (children) {
    return children(first, second, getResult(first, second, operator));
  }
  return (
    <p>
      {`Result of ${first} ${operator} ${second} is ${getResult(first, second, operator)}`}
    </p>
  );
};

MathFunction.propTypes = {
  first: PropTypes.number.isRequired,
  second: PropTypes.number.isRequired,
  operator: PropTypes.string.isRequired,
  children: PropTypes.func,
};

MathFunction.defaultProps = {
  children: null,
};

export default MathFunction;
