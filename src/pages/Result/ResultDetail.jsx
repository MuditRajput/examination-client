import React from 'react';
import {
  RadioGroup, Paper, Typography, Button, makeStyles, FormControlLabel,
  Radio, Container,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GETONE_RESULT, GETALL_QUESTIONS } from './query';

const useStyles = makeStyles((theme) => ({
  buttonBack: {
    margin: '10px',
  },
  question: {
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
  },
  options: {
    marginLeft: theme.spacing(2),
  },
  resultOption: {
    background: '#efefef',
    padding: '10px',
    marginTop: '10px',
  },
  correctOption: {
    borderRadius: '3px',
    background: '#98de8b80',
  },
  wrongOption: {
    borderRadius: '3px',
    background: '#eec5c5',
  },
}
));

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
      id: resultData ? resultData.getOneResult.data.questionSet : '',
    },
    fetchPolicy: 'network-only',
  });

  if (!getQuestionLoading && !questions.length) {
    if (data.getAllQuestions.data) {
      const { getAllQuestions: { data: questionsList = [] } = {} } = data;
      questions = questionsList;
    }
  }

  const colortype = (originalId, option) => {
    if ((result[originalId]?.[0]) && (result[originalId]?.[2] === option)) {
      return classes.correctOption;
    }
    if ((result[originalId]?.[0]) === false && (result[originalId]?.[2] === option)) {
      return classes.wrongOption;
    }
    return '';
  };

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
                  <FormControlLabel checked={(result[questionDetail.originalId]?.[2] === option)} className={colortype(questionDetail.originalId, option)} disabled key={`${questionDetail.originalId}${option}`} value={option} control={<Radio />} label={option} />
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
