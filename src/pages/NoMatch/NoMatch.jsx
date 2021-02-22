import { Typography, makeStyles } from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles((theme) => ({
  Spacing: {
    marginTop: theme.spacing(4),
  },
}));

const NoMatch = () => {
  const classes = useStyles();
  return (
    <>
      <Typography align="center" component="div" className={classes.Spacing}>
        <Typography variant="h3" component="div" color="secondary" display="inline">
          N
          <Typography variant="h4" component="div" display="inline">OT </Typography>
        </Typography>
        <Typography variant="h3" component="div" color="primary" display="inline">
          F
          <Typography variant="h4" component="div" display="inline">
            OUND
          </Typography>
        </Typography>
        <Typography variant="body2" align="center" color="textSecondary">
          Seems like the page you are searching for does not exist.
        </Typography>
      </Typography>
    </>
  );
};

export default NoMatch;
