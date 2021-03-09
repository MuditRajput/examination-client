import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  RadioGroup, FormControlLabel, Radio, Container, Typography, makeStyles, IconButton,
  Paper, Button, CircularProgress,
} from '@material-ui/core';
import { useQuery, useMutation } from '@apollo/client';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { EditQuestion } from './Components/EditQuestion';
import { DeleteDialog } from './Components/DeleteDialog';
import { GETALL_QUESTIONS } from './query';
import { UPDATE_QUESTIONS, DELETE_QUESTIONS, SUBMIT_QUESTIONS } from './mutation';
import { SnackbarContext } from '../../contexts';

const useStyles = makeStyles((theme) => ({
  question: {
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
  },
  options: {
    marginLeft: theme.spacing(2),
  },
  correctOption: {
    borderRadius: '3px',
    background: '#98de8b80',
  },
  wrongOption: {
    borderRadius: '3px',
    background: '#eec5c5',
  },
}));

const Exam = ({ match, history }) => {
  const classes = useStyles();
  const [editOpen, setEditOpen] = useState(false);
  const [state, setState] = useState({});
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [details, setDetails] = useState({});
  const [result, setResult] = useState({});

  const { id } = match.params;

  const {
    data, loading, refetch,
  } = useQuery(GETALL_QUESTIONS, {
    variables: {
      id,
    },
    fetchPolicy: 'network-only',
  });

  const [updateQuestions] = useMutation(UPDATE_QUESTIONS);
  const [deleteQuestions] = useMutation(DELETE_QUESTIONS);
  const [submitQuestions] = useMutation(SUBMIT_QUESTIONS);

  let questions = [];

  if (!loading && !questions.length) {
    if (data.getAllQuestions.data.length) {
      const { getAllQuestions: { data: questionsList = [] } = {} } = data;
      questions = questionsList;
    }
  }

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
    setState({ ...state, [originalId]: input.target.value });
  };

  const handleBack = () => {
    history.push('/exam');
  };

  const submitted = Object.keys(result).length !== 0;

  const handleSubmit = async (openSnackbar) => {
    try {
      const response = await submitQuestions({
        variables: { questionSet: id, answersList: state },
      });
      const {
        data: { submitQuestions: { result: resultResponse } = {} } = {},
      } = response;
      if (resultResponse) {
        refetch();
        openSnackbar('success', 'Successfull');
        setResult(resultResponse);
      } else {
        openSnackbar('error', 'Retry');
      }
    } catch {
      openSnackbar('error', 'Something went wrong');
    }
  };

  const colortype = (originalId, option) => {
    if (result[originalId] && (state[originalId] === option)) {
      return classes.correctOption;
    }
    if (result[originalId] === false && (state[originalId] === option)) {
      return classes.wrongOption;
    }
    return '';
  };

  if (loading) {
    return (
      <CircularProgress />
    );
  }

  if (!questions.length) {
    return (
      <Typography>
        No Questions
      </Typography>
    );
  }

  return (
    <SnackbarContext.Consumer>
      {({ openSnackbar }) => (
        <Container>
          {
            questions.map((questionDetail) => (
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
                    questionDetail.options.map((option) => (
                      <FormControlLabel className={colortype(questionDetail.originalId, option)} disabled={submitted} key={option} value={option} control={<Radio color="primary" />} label={option} />
                    ))
                  }
                </RadioGroup>
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
          {
            !submitted
            && (
              <Button variant="contained" onClick={() => handleSubmit(openSnackbar)} color="primary">
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
