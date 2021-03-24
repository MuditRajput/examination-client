import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  TextField, Button, Dialog, DialogContent, DialogActions,
  DialogTitle,
} from '@material-ui/core';
import * as yup from 'yup';
import { useStyles } from '../../style';

const EditQuestion = (props) => {
  const {
    onSubmit, open, onClose, defaultValues,
  } = props;
  const {
    options: defaultOptions = [], question: defaultQuestion, correctOption = [], marks = 0,
  } = defaultValues;

  let correctOptionString = '';
  correctOption.forEach((correct) => {
    correctOptionString = correctOptionString ? `${correctOptionString}|${correct}` : correct;
  });

  const [question, setQuestion] = useState({});

  const [defaultOptionValues, setDefaultOptionValues] = useState([]);

  const [onBlur, setBlur] = useState({});

  const [options, setOptions] = useState({});

  const [schemaErrors, setSchemaErrors] = useState({});

  // validation
  const schema = yup.object().shape({
    question: yup.string().required('question is required').min(3, 'should have more then 3 characters'),
    correctOption: yup.string().required('correct option is required'),
    marks: yup.number().required('Marks is required'),
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
    setQuestion({
      defaultQuestion, correctOption, marks, defaultOptions,
    });
    setBlur({
      question: true, correctOption: true, marks: true,
    });
  }, [defaultValues]);

  useEffect(() => {
    if ((!defaultOptionValues.length
      && defaultOptions.length)
      || !(JSON.stringify(defaultOptionValues) === JSON.stringify(defaultOptions))) {
      setDefaultOptionValues(defaultOptions);
    }
  }, [defaultOptions]);

  useEffect(() => {
    if (Object.values(options).length) {
      setQuestion({
        ...question, options: (Object.values(options)),
      });
    }
  }, [options]);

  const classes = useStyles();
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
        <div className={classes.flexRow}>
          <TextField
            size="small"
            fullWidth
            defaultValue={correctOptionString}
            onChange={(input) => handleEditQuestion('correctOption', input)}
            onBlur={() => handleBlur('correctOption')}
            label="Correct Option"
            variant="outlined"
          />
          <TextField
            size="small"
            fullWidth
            className={classes.flexElements}
            defaultValue={marks}
            onChange={(input) => handleEditQuestion('marks', input)}
            onBlur={() => handleBlur('marks')}
            label="Marks"
            variant="outlined"
          />
        </div>
        {
          defaultOptionValues.map((option, index) => (
            <TextField
              key={option}
              size="small"
              defaultValue={option}
              className={classes.optionsMargin}
              onBlur={() => handleBlur('option')}
              onChange={(input) => handleOptionField(`option${index + 1}`, input)}
              label="Option"
              variant="outlined"
            />
          ))
        }
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={() => { setDefaultOptionValues([...defaultOptionValues, ' ']); }} color="secondary">
          Add more options
        </Button>
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
