import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  DialogActions, Dialog, DialogContentText, DialogContent, CircularProgress,
  DialogTitle, Button, TextField, makeStyles,
} from '@material-ui/core';
import * as yup from 'yup';

export const useStyle = makeStyles(() => ({
  margin: {
    margin: '10px 0',
  },
}));

const EditExamination = (props) => {
  const {
    open, onClose, onSubmit, defaultValues, loading,
  } = props;

  const { subject, description, maximumMarks } = defaultValues;
  const classes = useStyle();
  const schema = yup.object().shape({
    subject: yup.string().required('Subject is required').min(3, 'should have more then 3 characters'),
    description: yup.string(),
    maximumMarks: yup.number(),
  });

  const [state, setstate] = useState({
    subject, description, maximumMarks,
  });

  const [onBlur, setBlur] = useState({});

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
      subject: '', description: '', maximumMarks: '',
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
        <TextField
          size="small"
          fullWidth
          defaultValue={maximumMarks}
          error={!!getError('maximumMarks')}
          helperText={getError('maximumMarks')}
          className={classes.margin}
          onChange={(input) => handleInputField('maximumMarks', input)}
          onBlur={() => handleBlur('maximumMarks')}
          label="Maximum Marks"
          variant="outlined"
        />
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