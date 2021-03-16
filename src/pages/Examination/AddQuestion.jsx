import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  TextField, Button, Container, IconButton, Paper,
  Typography, RadioGroup, FormControlLabel, Radio, InputAdornment,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { useMutation, useQuery } from '@apollo/client';
import * as yup from 'yup';
import { Form, Field } from 'react-final-form';
import { ConfirmDialog } from './Components/ConfirmDialog';
import { ADD_QUESTIONS, UPDATE_QUESTIONS, DELETE_QUESTIONS } from './mutation';
import { GETALL_QUESTIONS } from './query';
import { SnackbarContext } from '../../contexts';
import { EditQuestion } from './Components/EditQuestion';
import { DeleteDialog } from './Components/DeleteDialog';
import { useStyles } from './style';

const AddQuestions = (props) => {
  const { match, history } = props;
  const [onBlur, setBlur] = useState({});
  const [inputArray] = useState([1]);
  const [optionInputArray, setOptionInputArray] = useState([1, 1]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [schemaErrors, setSchemaErrors] = useState({});
  const [state, setState] = useState({});
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [details, setDetails] = useState({});

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
  const [createQuestions] = useMutation(ADD_QUESTIONS);

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

  const schema = yup.object().shape({
    question: yup.string().required('question is required').min(3, 'should have more then 3 characters'),
    correctOption: yup.string().required('correct option is required'),
  });

  const handleErrors = (errors) => {
    const schemaError = {};
    if (Object.keys(errors).length) {
      errors.inner.forEach((error) => {
        schemaError[error.path] = error.message;
      });
    }
    setSchemaErrors(schemaError);
  };

  const handleValidate = (newQuestions) => {
    newQuestions.forEach((question) => {
      schema.validate(question, { abortEarly: false })
        .then(() => { handleErrors({}); })
        .catch((err) => { handleErrors(err); });
    });
  };

  const hasErrors = () => Object.keys(schemaErrors).length !== 0;

  const isTouched = () => Object.keys(onBlur).length >= 2;

  const submitQuestions = async (openSnackbar) => {
    setConfirmOpen(false);
    try {
      if (!hasErrors()) {
        const variables = { originalId: id, questionList: state };
        const response = await createQuestions({
          variables,
        });
        const {
          data: { createQuestions: { message, status, data: responseData } = {} } = {},
        } = response;
        if (responseData) {
          openSnackbar(status, message);
          history.push('/exam');
        } else {
          openSnackbar('error', message);
        }
      }
      openSnackbar('error', 'Please enter correct values');
    } catch {
      openSnackbar('error', 'Something went wrong');
    }
  };

  const handleConfirmClose = () => {
    setConfirmOpen(false);
  };

  const handleBack = () => {
    history.push('/exam');
  };

  const getError = (label) => {
    if (onBlur[label]) {
      return schemaErrors[label] || '';
    }
    return '';
  };

  const handleBlur = (label) => {
    setBlur({ ...onBlur, [label]: true });
  };
  const closeOption = (arrayOfOptions, index) => {
    arrayOfOptions.splice(index, 1);
    return [...arrayOfOptions];
  };

  const handleSubmitQuestion = (values) => {
    const questionList = [];
    inputArray.forEach((val, index) => {
      const options = [];
      optionInputArray.forEach((value, optionIndex) => {
        if (values[`option${index}${optionIndex}`]) {
          options.push(values[`option${index}${optionIndex}`]);
        }
      });
      questionList.push({ question: values[`question${index}`], correctOption: values[`correct${index}`], options });
    });
    handleValidate(questionList);
    setConfirmOpen(true);
    setState(questionList);
  };

  const renderTextField = (input, className, fieldName, Label, optionIndex) => (
    <TextField
      size="small"
      {...input}
      fullWidth={!(optionIndex >= 0)}
      className={className}
      error={!!getError(fieldName)}
      helperText={getError(fieldName)}
      onBlur={() => handleBlur(fieldName)}
      label={Label}
      variant="outlined"
      InputProps={(optionIndex >= 0) ? {
        endAdornment: <InputAdornment position="end"><IconButton onClick={() => setOptionInputArray(closeOption(optionInputArray, optionIndex))} size="small"><CloseIcon style={{ fontSize: 20 }} opacity="0.6" /></IconButton></InputAdornment>,
      } : ''}
    />
  );

  const classes = useStyles();
  return (
    <SnackbarContext.Consumer>
      {({ openSnackbar }) => (
        <Container>
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
          <Form
            onSubmit={handleSubmitQuestion}
            render={({ handleSubmit }) => (
              <form onSubmit={handleSubmit}>
                {
                  inputArray.map((value, index) => (
                    <div key={`${index + 1}`}>
                      <Field
                        name={`question${index}`}
                        render={({ input }) => (
                          renderTextField(input, classes.margin, 'question', 'Question')
                        )}
                      />
                      <Field
                        name={`correct${index}`}
                        render={({ input }) => (
                          renderTextField(input, classes.margin, 'correctOption', 'Correct Option')
                        )}
                      />
                      {
                        optionInputArray.map((arrayValue, optionIndex) => (
                          <Field
                            key={`option${index + 1}${optionIndex + 1}`}
                            name={`option${index}${optionIndex}`}
                            render={({ input }) => (
                              renderTextField(input, classes.optionsMargin, '', 'Option', optionIndex)
                            )}
                          />
                        ))
                      }
                    </div>
                  ))
                }
                <div>
                  <Button className={classes.optionsMargin} variant="outlined" onClick={() => setOptionInputArray([...optionInputArray, 1])} color="secondary">
                    Add More Option Fields
                  </Button>
                  <Button className={classes.optionsMargin} variant="outlined" onClick={handleBack} color="secondary">
                    Close
                  </Button>
                </div>
                <Button fullWidth type="submit" className={classes.buttons} variant="contained" disabled={!isTouched()} color="primary">
                  Submit
                </Button>
              </form>
            )}
          />
          <ConfirmDialog
            open={confirmOpen}
            onSubmit={() => submitQuestions(openSnackbar)}
            onClose={handleConfirmClose}
          />
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
                <RadioGroup className={classes.options} aria-label="answer" name="solution">
                  {
                    questionDetail.options.map((option) => (
                      <FormControlLabel key={option} value={option} control={<Radio color="primary" />} label={option} />
                    ))
                  }
                </RadioGroup>
              </Paper>
            ))
          }
        </Container>
      )}
    </SnackbarContext.Consumer>
  );
};

AddQuestions.propTypes = {
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default AddQuestions;
