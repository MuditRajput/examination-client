import React from 'react';
import {
  RadioGroup, Paper, Typography, Button, FormControlLabel,
  Radio, Container, Checkbox, CircularProgress,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GETONE_RESULT, GETALL_QUESTIONS } from './query';
import { useStyles } from './style';
import { NoMatch } from '../NoMatch';

const ResultDetail = (props) => {
  const classes = useStyles();
  const { match: { params: { id = '' } = {} } = {} } = props;
  const { data: resultData, loading } = useQuery(GETONE_RESULT, {
    variables: {
      id,
    },
  });
  let result = {};
  if (!loading && !Object.keys(result).length) {
    if (resultData.getOneResult.data) {
      const { getOneResult: { data: { result: resultDetail } } = {} } = resultData;
      result = resultDetail;
    }
  }
  const resultValues = Object.values(result);
  const correctValues = resultValues.filter((value) => (value[0] || ''));
  let questions = [];
  const {
    data, loading: getQuestionLoading,
  } = useQuery(GETALL_QUESTIONS, {
    variables: {
      id: resultData ? resultData.getOneResult.data?.questionSet : '',
    },
    fetchPolicy: 'network-only',
  });

  if (!getQuestionLoading && !questions.length) {
    if (data?.getAllQuestions.data) {
      const { getAllQuestions: { data: questionsList = [] } = {} } = data;
      questions = questionsList;
    }
  }

  const colortype = (originalId, option) => {
    if ((result[originalId]?.[0])
    && (JSON.stringify(result[originalId]?.[2]) === JSON.stringify([option])
    || result[originalId]?.[2]?.includes(option))) {
      return classes.correctOption;
    }
    if ((result[originalId]?.[0]) === false
    && (JSON.stringify(result[originalId]?.[2]) === JSON.stringify([option])
    || result[originalId]?.[2]?.includes(option))) {
      return classes.wrongOption;
    }
    return '';
  };

  if (loading || getQuestionLoading) {
    return (
      <Typography component="div" align="center">
        <CircularProgress />
      </Typography>
    );
  }
  if (!Object.keys(result).length) {
    return (<NoMatch />);
  }

  return (
    <Container>
      <Typography align="right" variant="h4">
        Marks Obtained:
        {correctValues.length}
        /
        {Object.keys(result).length}
      </Typography>
      {
        questions.map((questionDetail) => (
          <Paper key={questionDetail.originalId} className={classes.question}>
            <Typography variant="h6">
              {questionDetail.question}
            </Typography>
            <RadioGroup className={classes.options} aria-label="answer" name="solution">
              {
                questionDetail.options.map((option) => (
                  <FormControlLabel
                    checked={result[questionDetail.originalId]?.[2]?.includes(option)}
                    className={colortype(questionDetail.originalId, option)}
                    disabled
                    key={`${questionDetail.originalId}${option}`}
                    value={option}
                    control={
                      (result[questionDetail.originalId][1].length === 1) ? <Radio /> : <Checkbox />
                    }
                    label={option}
                  />
                ))
              }
            </RadioGroup>
            <Typography key={result[questionDetail.originalId][1]} className={classes.resultOption} component="div" color="primary">
              <Typography color="textPrimary" component="i">
                {'Correct Answer:   '}
              </Typography>
              {result[questionDetail.originalId][1]}
            </Typography>
          </Paper>
        ))
      }
      <Link to="/results">
        <Button variant="contained" color="primary">
          Back
        </Button>
      </Link>
    </Container>
  );
};

ResultDetail.propTypes = {
  match: PropTypes.object.isRequired,
};

export default ResultDetail;
