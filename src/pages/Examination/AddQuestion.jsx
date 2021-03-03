import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  TextField, makeStyles, Button,
} from '@material-ui/core';
import * as yup from 'yup';
import { Form, Field } from 'react-final-form';

export const useStyle = makeStyles(() => ({
  margin: {
    margin: '10px',
  },
  buttons: {
    margin: '10px',
  },
}));

const AddQuestions = () => {
  const [onBlur, setBlur] = useState({});

  const [state, setState] = useState([]);

  const [inputArray, setInputArray] = useState([1]);

  const [optionInputArray, setOptionInputArray] = useState([1, 1]);

  const [schemaErrors, setSchemaErrors] = useState({});

  // validation
  const schema = yup.object().shape({
    question: yup.string().required('question is required').min(3, 'should have more then 3 characters'),
    correct: yup.string().required('correct option is required'),
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

  const handleValidate = () => {
    state.forEach((question) => {
      schema.validate(question, { abortEarly: false })
        .then(() => { handleErrors({}); })
        .catch((err) => { handleErrors(err); });
    });
  };

  const hasErrors = () => Object.keys(schemaErrors).length !== 0;

  const isTouched = () => Object.keys(onBlur).length !== 0;

  // Handlers
  const handleAddQuestion = () => {
    console.log(state);
  };

  const getError = (label) => {
    if (onBlur[label]) {
      return schemaErrors[label] || '';
    }
    return '';
  };

  const handleBlur = (label) => {
    handleValidate();
    setBlur({ ...onBlur, [label]: true });
  };

  const handleSubmitQuestion = (values) => {
    const questionList = [];
    inputArray.forEach((index) => {
      const options = optionInputArray.map((value, optionIndex) => {
        console.log(values[`option${index - 1}${optionIndex}`]);
        return values[`option${index - 1}${optionIndex}`];
      });
      questionList.push({ question: values[`question${index - 1}`], correct: values[`correct${index - 1}`], options });
    });
    setState(questionList);
  };

  const classes = useStyle();
  return (
    <>
      <Form
        onSubmit={handleSubmitQuestion}
        render={({ handleSubmit }) => (
          inputArray.map((value, index) => (
            <form key={`${value}${index + 1}`} onSubmit={handleSubmit}>
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
                    error={!!getError('correct')}
                    helperText={getError('correct')}
                    onBlur={() => handleBlur('correct')}
                    label="Correct Option"
                    variant="outlined"
                  />
                )}
              />
              {
                optionInputArray.map((arrayValue, optionIndex) => (
                  <Field
                    key={`${optionIndex + 1}`}
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
              <Button type="submit" className={classes.buttons} variant="contained" disabled={hasErrors() || !isTouched()} onClick={handleAddQuestion} color="primary">
                Submit
              </Button>
            </form>
          ))
        )}
      />
      <Button className={classes.buttons} variant="contained" onClick={() => setOptionInputArray([...optionInputArray, 1, 1])} color="primary">
        Add More Option Fields
      </Button>
      <Button className={classes.buttons} variant="contained" onClick={() => setInputArray([...inputArray, 1])} color="primary">
        Add Question
      </Button>
    </>
  );
};

AddQuestions.propTypes = {
  match: PropTypes.object.isRequired,
};

export default AddQuestions;
