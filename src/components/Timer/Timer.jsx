import React from 'react';
import PropTypes from 'prop-types';
import TimerIcon from '@material-ui/icons/Timer';
import { Typography } from '@material-ui/core';

const Timer = (props) => {
  const { seconds: totalSeconds, onComplete } = props;

  if (totalSeconds <= 0) {
    onComplete();
  }

  const seconds = totalSeconds % 60;
  const totalMinutes = Math.floor(totalSeconds / 60);
  const minutes = totalMinutes % 60;
  const hours = Math.floor(totalMinutes / 60);

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
  seconds: PropTypes.number,
  onComplete: PropTypes.func.isRequired,
};

Timer.defaultProps = {
  seconds: 59,
};

export default Timer;
