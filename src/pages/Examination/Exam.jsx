import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  RadioGroup, FormControlLabel, Radio, Container, Typography, makeStyles, IconButton,
  Paper, Button, CircularProgress,
} from '@material-ui/core';
import { useQuery } from '@apollo/client';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { EditQuestion } from './Components/EditQuestion';
import { DeleteDialog } from './Components/DeleteDialog';
import { GETALL_QUESTIONS } from './query';

const useStyles = makeStyles((theme) => ({
  question: {
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
  },
  options: {
    marginLeft: theme.spacing(2),
  },
}));

const Exam = ({ match }) => {
  const classes = useStyles();
  const [editOpen, setEditOpen] = useState(false);
  const [state, setState] = useState({});
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [details, setDetails] = useState({});
  const [questions, setQuestions] = useState([]);

  const {
    data, loading,
  } = useQuery(GETALL_QUESTIONS, {
    variables: {
      id: match.params.id,
    },
    fetchPolicy: 'cache-and-network',
  });

  if (!loading && !questions.length) {
    if (data.getAllQuestions.data.length) {
      const { getAllQuestions: { data: questionsList = [] } = {} } = data;
      setQuestions(questionsList);
    }
  }

  const handleEdit = (questionDetails) => {
    setEditOpen(true);
    setDetails(questionDetails);
  };

  const handleEditClose = () => {
    setEditOpen(false);
  };

  const handleEditSubmit = (newDetails) => {
    setEditOpen(false);
    console.log(newDetails);
  };

  const deleteOpenAndClose = (questionDetails) => {
    setDetails(questionDetails);
    setDeleteOpen(!deleteOpen);
  };

  const handleDelete = () => {
    setDeleteOpen(false);
    console.log(details);
  };

  const handleOptionField = (input, originalId) => {
    setState({ ...state, [originalId]: input.target.value });
  };

  const handleSubmit = () => {
    console.log(state);
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
                  <FormControlLabel key={option} value={option} control={<Radio color="primary" />} label={option} />
                ))
              }
            </RadioGroup>
          </Paper>
        ))
      }
      <EditQuestion
        open={editOpen}
        defaultValues={details}
        onSubmit={handleEditSubmit}
        onClose={handleEditClose}
      />
      <DeleteDialog
        open={deleteOpen}
        onClose={deleteOpenAndClose}
        onDelete={handleDelete}
      />
      <Button variant="contained" onClick={handleSubmit} color="primary">
        Submit
      </Button>
    </Container>
  );
};

Exam.propTypes = {
  match: PropTypes.object.isRequired,
};

export default Exam;
