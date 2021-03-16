import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  TextField, Button, Dialog, makeStyles, DialogContent, DialogActions,
  DialogTitle,
} from '@material-ui/core';
import * as yup from 'yup';

export const useStyle = makeStyles(() => ({
  margin: {
    margin: '10px 0',
  },
}));

const EditQuestion = (props) => {
  const {
    onSubmit, open, onClose, defaultValues,
  } = props;
  const { options: defaultOptions = [], question: defaultQuestion, correctOption } = defaultValues;

  const [question, setQuestion] = useState({});

  const [onBlur, setBlur] = useState({});

  const [options, setOptions] = useState({});

  const [schemaErrors, setSchemaErrors] = useState({});

  // validation
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

  const handleValidate = () => {
    schema.validate(question, { abortEarly: false })
      .then(() => { handleErrors({}); })
      .catch((err) => { handleErrors(err); });
  };

  const hasErrors = () => Object.keys(schemaErrors).length !== 0;

  const isTouched = () => Object.keys(onBlur).length !== 0;

  // Handlers
  const handleClose = () => {
    onClose();
    setOptions({});
    setQuestion({});
  };

  const handleEditSubmit = () => {
    onSubmit(question);
    handleClose();
  };

  const getError = (label) => {
    if (onBlur[label]) {
      return schemaErrors[label] || '';
    }
    return '';
  };

  const handleOptionField = (label, input) => {
    const previousOptions = {};
    if (!Object.keys(options).length) {
      defaultOptions.forEach((value, index) => {
        previousOptions[`option${index + 1}`] = value;
      });
    }
    setOptions({ ...previousOptions, ...options, [label]: input.target.value });
  };

  const handleEditQuestion = (label, input) => {
    setQuestion({
      ...question, [label]: input.target.value,
    });
  };
  const handleBlur = (label) => {
    handleValidate();
    setBlur({ ...onBlur, [label]: true });
  };

  useEffect(() => {
    if (Object.values(options).length) {
      setQuestion({
        ...question, options: (Object.values(options)),
      });
    }
  }, [options]);

  const classes = useStyle();
  return (
    <Dialog
      open={open}
      fullWidth
      onClose={onClose}
      maxWidth="md"
    >
      <DialogContent>
        <DialogTitle>
          Edit Question
        </DialogTitle>
        <TextField
          size="small"
          fullWidth
          className={classes.margin}
          defaultValue={defaultQuestion}
          error={!!getError('subject')}
          helperText={getError('subject')}
          onChange={(input) => handleEditQuestion('question', input)}
          onBlur={() => { handleBlur('question'); }}
          label="Question"
          variant="outlined"
        />
        <TextField
          size="small"
          fullWidth
          className={classes.margin}
          defaultValue={correctOption}
          onChange={(input) => handleEditQuestion('correctOption', input)}
          onBlur={() => handleBlur('correctOption')}
          label="Correct Option"
          variant="outlined"
        />
        {
          defaultOptions.map((option, index) => (
            <TextField
              key={option}
              size="small"
              fullWidth
              defaultValue={option}
              className={classes.margin}
              onBlur={() => handleBlur('option')}
              onChange={(input) => handleOptionField(`option${index + 1}`, input)}
              label="Option"
              variant="outlined"
            />
          ))
        }
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleClose} color="secondary">
          Close
        </Button>
        <Button disabled={hasErrors() || !isTouched()} onClick={handleEditSubmit} color="primary">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

EditQuestion.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool,
  defaultValues: PropTypes.object,
};

EditQuestion.defaultProps = {
  open: false,
  defaultValues: {},
};

export default EditQuestion;
