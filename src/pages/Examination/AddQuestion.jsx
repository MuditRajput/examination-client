import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  TextField, makeStyles, DialogTitle, Button,
} from '@material-ui/core';
import * as yup from 'yup';

export const useStyle = makeStyles(() => ({
  margin: {
    margin: '10px 0',
  },
}));

const AddQuestions = (props) => {
  const { match } = props;
  console.log(match.path);
  const [question, setQuestion] = useState({});

  const [onBlur, setBlur] = useState({});

  const [options, setOptions] = useState({});

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
    schema.validate(question, { abortEarly: false })
      .then(() => { handleErrors({}); })
      .catch((err) => { handleErrors(err); });
  };

  const hasErrors = () => Object.keys(schemaErrors).length !== 0;

  const isTouched = () => Object.keys(onBlur).length !== 0;

  // Handlers
  const handleClose = () => {
    setOptions({});
    setQuestion({});
  };

  const handleAddQuestion = () => {
    console.log(Object.values(options));
    console.log(question, 'check');
    handleClose();
  };

  const getError = (label) => {
    if (onBlur[label]) {
      return schemaErrors[label] || '';
    }
    return '';
  };

  const handleOptionField = (label, input) => {
    setOptions({ ...options, [label]: input.target.value });
  };

  const handleQuestionField = (label, input) => {
    setQuestion({
      ...question, [label]: input.target.value,
    });
  };
  const handleBlur = (label) => {
    handleValidate();
    setBlur({ ...onBlur, [label]: true });
  };

  useEffect(() => {
    setQuestion({
      ...question, options: (Object.values(options)),
    });
  }, [options]);

  const classes = useStyle();
  return (
    <>
      <DialogTitle>
        Add Questions
      </DialogTitle>
      <TextField
        size="small"
        fullWidth
        className={classes.margin}
        error={!!getError('subject')}
        helperText={getError('subject')}
        onChange={(input) => handleQuestionField('question', input)}
        onBlur={() => { handleBlur('question'); }}
        label="Question"
        variant="outlined"
      />
      <TextField
        size="small"
        fullWidth
        className={classes.margin}
        onChange={(input) => handleQuestionField('correct', input)}
        onBlur={() => handleBlur('correct')}
        label="Correct Option"
        variant="outlined"
      />
      <TextField
        size="small"
        fullWidth
        className={classes.margin}
        onChange={(input) => handleOptionField('option1', input)}
        label="Option"
        variant="outlined"
      />
      <TextField
        size="small"
        fullWidth
        className={classes.margin}
        onChange={(input) => handleOptionField('option2', input)}
        label="Option"
        variant="outlined"
      />
      <TextField
        size="small"
        fullWidth
        className={classes.margin}
        onChange={(input) => handleOptionField('option3', input)}
        label="Option"
        variant="outlined"
      />
      <TextField
        size="small"
        fullWidth
        className={classes.margin}
        onChange={(input) => handleOptionField('option4', input)}
        label="Option"
        variant="outlined"
      />
      <Button autoFocus onClick={handleClose} color="secondary">
        Close
      </Button>
      <Button disabled={hasErrors() || !isTouched()} onClick={handleAddQuestion} color="primary">
        Add Question
      </Button>
    </>
  );
};

AddQuestions.propTypes = {
  match: PropTypes.object.isRequired,
};

export default AddQuestions;
