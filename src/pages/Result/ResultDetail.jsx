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
      const { getOneResult: { data: { result: resultDetail = {} } = {} } = {} } = resultData;
      result = resultDetail;
    }
  }
  let obtainedMarks = 0;
  Object.values(result).forEach((resultValue) => {
    obtainedMarks += Number(resultValue[0]);
  });
  let questions = [];
  let totalMarks = 0;
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
      questionsList.forEach((question) => {
        totalMarks += Number(question.marks);
      });
    }
  }

  const colortype = (originalId, option) => {
    if ((result[originalId]?.[0])
    && (JSON.stringify(result[originalId]?.[2]) === JSON.stringify([option])
    || result[originalId]?.[2]?.includes(option))) {
      return classes.correctOption;
    }
    if ((result[originalId]?.[0]) === 0
    && (JSON.stringify(result[originalId]?.[2]) === JSON.stringify([option])
    || result[originalId]?.[2]?.includes(option))) {
      return classes.wrongOption;
    }
    return '';
  };

  if (loading || getQuestionLoading) {
    return (
      <Typography data-testid="progress" component="div" align="center">
        <CircularProgress />
      </Typography>
    );
  }
  if (!Object.keys(result).length) {
    return (<NoMatch />);
  }

  return (
    <Container data-testid="container">
      <Typography align="right" variant="h4">
        Marks Obtained:
        {obtainedMarks}
        /
        {totalMarks}
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
                      (result[questionDetail.originalId]?.[1].length === 1)
                        ? <Radio /> : <Checkbox />
                    }
                    label={option}
                  />
                ))
              }
            </RadioGroup>
            <Typography className={classes.resultOption} component="div" color="primary">
              <Typography color="textPrimary" component="i">
                {'Correct Answer:   '}
              </Typography>
              {result[questionDetail.originalId] ? result[questionDetail.originalId][1].map((correct) => ` ${correct} `) : ''}
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
