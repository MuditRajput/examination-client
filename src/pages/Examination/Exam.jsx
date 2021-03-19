import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  RadioGroup, FormControlLabel, Radio, Container, Typography, IconButton,
  Paper, Button, CircularProgress, Checkbox,
} from '@material-ui/core';
import { useQuery, useMutation } from '@apollo/client';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { EditQuestion } from './Components/EditQuestion';
import { DeleteDialog } from './Components/DeleteDialog';
import { ConfirmDialog } from './Components/ConfirmDialog';
import { GETALL_QUESTIONS } from './query';
import { UPDATE_QUESTIONS, DELETE_QUESTIONS, SUBMIT_QUESTIONS } from './mutation';
import { SnackbarContext } from '../../contexts';
import { Timer } from '../../components';
import { useStyles } from './style';

const Exam = ({ match, history }) => {
  const classes = useStyles();
  const [editOpen, setEditOpen] = useState(false);
  const [state, setState] = useState({});
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [details, setDetails] = useState({});
  const [result, setResult] = useState({});
  const [viewTimer, setViewTimer] = useState(true);
  const [seconds, setSeconds] = useState();
  const [marks, setMarks] = useState(0);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const maximumAttempts = localStorage.getItem('maxAttempts');
  const { id } = match.params;

  const submitted = Object.keys(result).length !== 0;

  const {
    data, loading, refetch,
  } = useQuery(GETALL_QUESTIONS, {
    variables: {
      id,
      timeLimit: Number(localStorage.getItem('time')) || 0,
      submitted: `${submitted}`,
    },
    fetchPolicy: 'network-only',
  });

  const [updateQuestions] = useMutation(UPDATE_QUESTIONS);
  const [deleteQuestions] = useMutation(DELETE_QUESTIONS);
  const [submitQuestions] = useMutation(SUBMIT_QUESTIONS);

  let questions = [];
  let numberOfAttempts = 0;
  if (!loading) {
    const {
      getAllQuestions: { data: questionsList = [], numberOfAttempts: attempts = 0, timeLeft } = {},
    } = data;
    questions = questionsList;
    if (!Object.keys(result).length) {
      numberOfAttempts = attempts;
    }
    if (seconds === undefined) {
      setSeconds(Math.floor(timeLeft / 1000) - 1);
    }
  }

  useEffect(() => {
    if (seconds && !submitted) {
      setTimeout(() => {
        setSeconds(seconds - 1);
      }, 1000);
    }
  }, [seconds]);
  const handleEdit = (questionDetails) => {
    setEditOpen(true);
    setDetails(questionDetails);
  };

  const handleEditClose = () => {
    setEditOpen(false);
  };

  const handleEditSubmit = async (questionInput, openSnackbar) => {
    try {
      const response = await updateQuestions({
        variables: { originalId: details.originalId, questionInput },
      });
      const {
        data: { updateQuestions: { message, status, data: responseData } = {} } = {},
      } = response;
      if (responseData) {
        refetch();
        openSnackbar(status, message);
        setEditOpen(false);
      } else {
        openSnackbar('error', message);
      }
    } catch {
      openSnackbar('error', 'Something went wrong');
    }
  };

  const deleteOpenAndClose = (questionDetails) => {
    setDetails(questionDetails);
    setDeleteOpen(!deleteOpen);
  };

  const handleDelete = async (openSnackbar) => {
    try {
      const response = await deleteQuestions({
        variables: { originalId: details.originalId },
      });
      const {
        data: { deleteQuestions: { message, status } = {} } = {},
      } = response;
      if (status === 'success') {
        refetch();
        openSnackbar(status, message);
        setDeleteOpen(false);
      } else {
        openSnackbar('error', message);
      }
    } catch {
      openSnackbar('error', 'Something went wrong');
    }
  };

  const handleOptionField = (input, originalId) => {
    setState({ ...state, [originalId]: [input.target.value] });
  };

  const removeElement = (array, value) => {
    const index = array.indexOf(value);
    if (index > -1) {
      array.splice(index, 1);
    }
    return [...array];
  };

  const handleCheckboxField = (input, originalId) => {
    if (!state[originalId] || !state[originalId].length) {
      setState({ ...state, [originalId]: [input.target.value] });
      return;
    }
    if (state[originalId].includes(input.target.value)) {
      setState({ ...state, [originalId]: removeElement(state[originalId], input.target.value) });
    } else {
      setState({ ...state, [originalId]: [...state[originalId], input.target.value] });
    }
  };

  const handleBack = () => {
    history.push('/exam');
  };

  const handleConfirmClose = () => {
    setConfirmOpen(false);
  };

  const handleConfirmSubmit = async (openSnackbar, message) => {
    try {
      const response = await submitQuestions({
        variables: { questionSet: id, answersList: state },
      });
      const {
        data: { submitQuestions: { result: resultResponse } = {} } = {},
      } = response;
      setViewTimer(false);
      if (resultResponse) {
        if (message) {
          openSnackbar('error', message);
        } else {
          openSnackbar('success', 'Successfull');
        }
        const resultValues = Object.values(resultResponse);
        const correctValues = resultValues.filter((value) => (value[0] || ''));
        setMarks(correctValues.length);
        setResult(resultResponse);
        setConfirmOpen(false);
        refetch();
      } else {
        openSnackbar('error', 'Retry');
      }
    } catch {
      openSnackbar('error', 'Something went wrong');
    }
  };

  const handleSubmit = () => {
    setConfirmOpen(true);
  };

  const colortype = (originalId, option) => {
    if ((result[originalId]?.[0])
    && (JSON.stringify(state[originalId]) === JSON.stringify([option])
    || state[originalId]?.includes(option))) {
      return classes.correctOption;
    }
    if ((result[originalId]?.[0]) === false
    && (JSON.stringify(state[originalId]) === JSON.stringify([option])
    || state[originalId]?.includes(option))) {
      return classes.wrongOption;
    }
    return '';
  };

  if (loading) {
    return (
      <CircularProgress />
    );
  }

  if (Number(maximumAttempts) === numberOfAttempts) {
    return (
      <Typography component="div" align="center">
        <Typography variant="h4">
          Attempt Limit Reached
        </Typography>
        <Typography>
          <Button className={classes.spacing} variant="contained" color="primary" onClick={handleBack}>
            Back
          </Button>
        </Typography>
      </Typography>
    );
  }

  if (!questions.length) {
    return (
      <Typography component="div" align="center">
        <Typography variant="h4">
          No Questions !!!
        </Typography>
        <Typography>
          <Button className={classes.spacing} variant="contained" color="primary" onClick={handleBack}>
            Back
          </Button>
        </Typography>
      </Typography>
    );
  }

  return (
    <SnackbarContext.Consumer>
      {({ openSnackbar }) => (
        <Container>
          { !viewTimer
            ? (
              <Typography align="right" variant="h4">
                Marks Obtained:
                {marks}
                /
                {Object.keys(result).length}
              </Typography>
            )
            : <Timer seconds={seconds} onComplete={() => handleConfirmSubmit(openSnackbar, 'Timeout !!!')} />}
          {
            questions.map((questionDetail, index) => (
              <Paper key={questionDetail.originalId} className={classes.question}>
                <Typography variant="h6">
                  {questionDetail.question}
                </Typography>
                <Typography align="right">
                  {
                    questionDetail.correctOption
                && (
                  <>
                    <IconButton disableFocusRipple size="small" onClick={() => handleEdit(questionDetail)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton disableFocusRipple size="small" onClick={() => deleteOpenAndClose(questionDetail)}>
                      <DeleteIcon />
                    </IconButton>
                  </>
                )
                  }
                </Typography>
                <RadioGroup className={classes.options} onChange={(input) => { handleOptionField(input, questionDetail.originalId); }} aria-label="answer" name="solution">
                  {
                    questionDetail.options.map((option, optionIndex) => (
                      <FormControlLabel
                        className={colortype(questionDetail.originalId, option)}
                        disabled={submitted}
                        key={`${questionDetail.originalId}/${index + 1}/${optionIndex + 1}`}
                        value={option}
                        control={(questionDetail.optionType === 'radio') ? <Radio color="primary" /> : <Checkbox onClick={(input) => handleCheckboxField(input, questionDetail.originalId)} color="primary" />}
                        label={option}
                      />
                    ))
                  }
                </RadioGroup>
                {
                  submitted
                  && (
                    <Typography className={classes.resultOption} component="div" color="primary">
                      <Typography color="textPrimary" component="i">
                        {'Correct Answer:   '}
                      </Typography>
                      {result[questionDetail.originalId][1].map((correct) => ` ${correct} `)}
                    </Typography>
                  )
                }
              </Paper>
            ))
          }
          <EditQuestion
            open={editOpen}
            defaultValues={details}
            onSubmit={(input) => handleEditSubmit(input, openSnackbar)}
            onClose={handleEditClose}
          />
          <DeleteDialog
            open={deleteOpen}
            onClose={deleteOpenAndClose}
            onDelete={() => handleDelete(openSnackbar)}
          />
          <ConfirmDialog
            open={confirmOpen}
            onClose={handleConfirmClose}
            onSubmit={() => handleConfirmSubmit(openSnackbar)}
            text="SUBMIT EXAM"
          />
          {
            !submitted
            && (
              <Button variant="contained" onClick={handleSubmit} color="primary">
                Submit
              </Button>
            )
          }
          {
            submitted
            && (
              <Button variant="contained" onClick={handleBack} color="primary">
                Back
              </Button>
            )
          }
        </Container>
      )}
    </SnackbarContext.Consumer>
  );
};

Exam.propTypes = {
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default Exam;
