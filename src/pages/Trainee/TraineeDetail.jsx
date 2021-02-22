import React, { useState, useEffect } from 'react';
import {
  Card, CardContent, Typography, Button, makeStyles,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { NoMatch } from '..';
import { GET_ONE } from './query';

const useStyles = makeStyles(() => ({
  buttonBack: {
    margin: '10px',
  },
  card: {
    display: 'flex',
  },
  imageCard: {
    width: '130px',
  },
}
));

const getDateFormatted = (date) => moment(date).format('dddd, MMMM Do yyyy, hh:mm:ss a');

const TraineeDetail = (props) => {
  const { match: { params: { id = '' } = {} } = {} } = props;
  const { refetch } = useQuery(GET_ONE, {
    variables: {
      id,
    },
  });
  const [state, setState] = useState({});
  const getTrainee = async () => {
    try {
      const response = await refetch();
      const { data: { getOneTrainee: { data } = {} } = {} } = response;
      setState(data);
    } catch {
      setState({});
    }
  };
  const classes = useStyles();

  useEffect(() => {
    getTrainee();
  }, []);

  if (!state) {
    return <NoMatch />;
  }
  return (
    <>
      <Card className={classes.card}>
        <img className={classes.imageCard} alt="thumbnail" src={`${process.env.PUBLIC_URL}/images/programmer.png`} />
        <CardContent>
          <Typography variant="h5">{state.name}</Typography>
          <Typography color="textSecondary">{getDateFormatted(state.createdAt)}</Typography>
          <Typography>{state.email}</Typography>
        </CardContent>
      </Card>
      <Typography align="center" className={classes.buttonBack}>
        <Link to="/">
          <Button variant="outlined" color="primary">
            Back
          </Button>
        </Link>
      </Typography>
    </>
  );
};

TraineeDetail.propTypes = {
  match: PropTypes.object.isRequired,
};

export default TraineeDetail;
