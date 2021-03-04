import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  TextField, makeStyles, Button,
} from '@material-ui/core';
import * as yup from 'yup';
import { Form, Field } from 'react-final-form';
import { ConfirmDialog } from './Components/ConfirmDialog';

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

  const handleValidate = (questions) => {
    questions.forEach((question) => {
      schema.validate(question, { abortEarly: false })
        .then(() => { handleErrors({}); })
        .catch((err) => { handleErrors(err); });
    });
  };

  const hasErrors = () => Object.keys(schemaErrors).length !== 0;

  const isTouched = () => Object.keys(onBlur).length >= 2;

  const submitQuestions = () => {
    setConfirmOpen(false);
    if (!hasErrors()) {
      console.log('id', match.params.id);
      console.log(state);
      history.push('/exam');
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
    console.log(values);
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
    <>
      <Form
        onSubmit={handleSubmitQuestion}
        render={({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            {
              inputArray.map((value, index) => (
                <>
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
                </>
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
        onSubmit={submitQuestions}
        onClose={handleConfirmClose}
      />
    </>
  );
};

AddQuestions.propTypes = {
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default AddQuestions;
