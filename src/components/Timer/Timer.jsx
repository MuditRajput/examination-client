import React from 'react';
import PropTypes from 'prop-types';
import TimerIcon from '@material-ui/icons/Timer';
import { Typography } from '@material-ui/core';

const Timer = (props) => {
  const {
    minutes: totalMinutes, lastMinuteFlag, onComplete, seconds,
  } = props;

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (lastMinuteFlag && seconds === 0 && minutes === 0) {
    onComplete();
  }

  return (
    <Typography align="right">
      <TimerIcon style={{ fontSize: '24px' }} />
      <Typography style={{ display: 'inlineblock', marginBottom: '10px' }} component="span" variant="h4">
        {hours}
        :
        {minutes}
        :
        {seconds}
      </Typography>
    </Typography>
  );
};

Timer.propTypes = {
  minutes: PropTypes.number,
  seconds: PropTypes.number,
  onComplete: PropTypes.func.isRequired,
  lastMinuteFlag: PropTypes.bool.isRequired,
};

Timer.defaultProps = {
  minutes: 59,
  seconds: 59,
};

export default Timer;
