import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  TextField, makeStyles, Button,
} from '@material-ui/core';
import { useMutation } from '@apollo/client';
import * as yup from 'yup';
import { Form, Field } from 'react-final-form';
import { ConfirmDialog } from './Components/ConfirmDialog';
import { ADD_QUESTIONS } from './mutation';
import { SnackbarContext } from '../../contexts';

export const useStyle = makeStyles(() => ({
  margin: {
    margin: '10px',
  },
  buttons: {
    margin: '10px',
  },
}));

const AddQuestions = (props) => {
  const { match, history } = props;
  const [onBlur, setBlur] = useState({});
  const [inputArray, setInputArray] = useState([1]);
  const [optionInputArray, setOptionInputArray] = useState([1, 1]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [schemaErrors, setSchemaErrors] = useState({});
  const [state, setState] = useState({});

  const [createQuestions] = useMutation(ADD_QUESTIONS);

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

  const handleValidate = (questions) => {
    questions.forEach((question) => {
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
        const variables = { originalId: match.params.id, questionList: state };
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
    } catch {
      openSnackbar('error', 'Something went wrong');
    }
  };

  const handleConfirmClose = () => {
    setConfirmOpen(false);
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

  const classes = useStyle();
  return (
    <SnackbarContext.Consumer>
      {({ openSnackbar }) => (
        <>
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
                          <TextField
                            size="small"
                            {...input}
                            fullWidth
                            className={classes.margin}
                            error={!!getError('question')}
                            helperText={getError('question')}
                            onBlur={() => handleBlur('question')}
                            label="Question"
                            variant="outlined"
                          />
                        )}
                      />
                      <Field
                        name={`correct${index}`}
                        render={({ input }) => (
                          <TextField
                            size="small"
                            {...input}
                            fullWidth
                            className={classes.margin}
                            error={!!getError('correctOption')}
                            helperText={getError('correctOption')}
                            onBlur={() => handleBlur('correctOption')}
                            label="Correct Option"
                            variant="outlined"
                          />
                        )}
                      />
                      {
                        optionInputArray.map((arrayValue, optionIndex) => (
                          <Field
                            key={`option${index + 1}${optionIndex + 1}`}
                            name={`option${index}${optionIndex}`}
                            render={({ input }) => (
                              <TextField
                                {...input}
                                size="small"
                                className={classes.margin}
                                label="Option"
                                variant="outlined"
                              />
                            )}
                          />
                        ))
                      }
                    </div>
                  ))
                }
                <div>
                  <Button className={classes.buttons} variant="outlined" onClick={() => setOptionInputArray([...optionInputArray, 1])} color="secondary">
                    Add More Option Fields
                  </Button>
                  <Button className={classes.buttons} variant="outlined" onClick={() => setInputArray([...inputArray, 1])} color="secondary">
                    Add Question
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
        </>
      )}
    </SnackbarContext.Consumer>
  );
};

AddQuestions.propTypes = {
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default AddQuestions;
