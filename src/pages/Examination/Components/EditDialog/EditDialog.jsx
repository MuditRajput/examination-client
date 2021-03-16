import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  DialogActions, Dialog, DialogContentText, DialogContent, CircularProgress,
  DialogTitle, Button, TextField,
} from '@material-ui/core';
import * as yup from 'yup';
import { useStyles } from '../../style';

const EditExamination = (props) => {
  const {
    open, onClose, onSubmit, defaultValues, loading,
  } = props;

  const {
    subject, description, maximumMarks, time, maxAttempts,
  } = defaultValues;
  const classes = useStyles();
  const schema = yup.object().shape({
    subject: yup.string().required('Subject is required').min(3, 'should have more then 3 characters'),
    description: yup.string(),
    maximumMarks: yup.number(),
    time: yup.number().required('Time is required'),
    maxAttempts: yup.number().required('Maximum number of attepts is required'),
  });

  const [state, setstate] = useState({
    subject, description, maximumMarks, time, maxAttempts,
  });

  const [onBlur, setBlur] = useState({
    subject: true, description: true, maximumMarks: true, time: true, maxAttempts: true,
  });

  const [schemaErrors, setSchemaErrors] = useState({});

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
    schema.validate(state, { abortEarly: false })
      .then(() => { handleErrors({}); })
      .catch((err) => { handleErrors(err); });
  };

  const handleBlur = (label) => {
    setBlur({ ...onBlur, [label]: true });
  };

  const getError = (label) => {
    if (onBlur[label]) {
      return schemaErrors[label] || '';
    }
    return '';
  };

  useEffect(() => {
    handleValidate();
  }, [state]);

  const hasErrors = () => Object.keys(schemaErrors).length !== 0;

  const isTouched = () => Object.keys(onBlur).length !== 0;

  const handleInputField = (label, input) => {
    setstate({
      ...state, [label]: input.target.value,
    });
  };

  const handleOnSubmit = () => {
    onSubmit(state);
    setstate({
      subject: '', description: '', maximumMarks: '', time: '', maxAttempts: '',
    });
    setBlur({});
  };

  return (
    <Dialog
      open={open}
      fullWidth
      onClose={onClose}
      maxWidth="md"
    >
      <DialogTitle>
        Add Examination
      </DialogTitle>
      <DialogContent>
        <DialogContentText fontSize={16}>
          Enter Your Examination Details
        </DialogContentText>
        <TextField
          required
          size="small"
          fullWidth
          defaultValue={subject}
          error={!!getError('subject')}
          helperText={getError('subject')}
          className={classes.margin}
          onChange={(input) => handleInputField('subject', input)}
          onBlur={() => handleBlur('subject')}
          label="Subject"
          id="outlined-start-adornment"
          variant="outlined"
        />
        <TextField
          size="small"
          fullWidth
          defaultValue={description}
          error={!!getError('description')}
          helperText={getError('description')}
          className={classes.margin}
          onChange={(input) => handleInputField('description', input)}
          onBlur={() => handleBlur('description')}
          label="Description"
          variant="outlined"
        />
        <div className={classes.flexRow}>
          <TextField
            size="small"
            fullWidth
            defaultValue={maximumMarks}
            error={!!getError('maximumMarks')}
            helperText={getError('maximumMarks')}
            onChange={(input) => handleInputField('maximumMarks', input)}
            onBlur={() => handleBlur('maximumMarks')}
            label="Maximum Marks"
            variant="outlined"
          />
          <TextField
            id="outlined-number"
            type="number"
            variant="outlined"
            size="small"
            fullWidth
            defaultValue={time}
            error={!!getError('time')}
            helperText={getError('time')}
            className={classes.flexElements}
            onChange={(input) => handleInputField('time', input)}
            onBlur={() => handleBlur('time')}
            label="Time (in minutes)"
          />
          <TextField
            id="outlined-number"
            type="number"
            variant="outlined"
            size="small"
            fullWidth
            defaultValue={maxAttempts}
            error={!!getError('maxAttempts')}
            helperText={getError('maxAttempts')}
            className={classes.flexElements}
            onChange={(input) => handleInputField('maxAttempts', input)}
            onBlur={() => handleBlur('maxAttempts')}
            label="Maximum number of attempts"
          />
        </div>
      </DialogContent>
      <DialogActions className={classes.margin}>
        <Button autoFocus onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button disabled={hasErrors() || !isTouched() || loading} onClick={() => handleOnSubmit(state)} color="primary">
          Submit
          { loading && <CircularProgress />}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

EditExamination.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  defaultValues: PropTypes.object,
};

EditExamination.defaultProps = {
  open: false,
  defaultValues: {},
  loading: false,
};

export default EditExamination;
