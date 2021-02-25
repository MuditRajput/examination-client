import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  TextField, Button, Dialog, makeStyles, DialogContent, DialogActions,
} from '@material-ui/core';

export const useStyle = makeStyles(() => ({
  margin: {
    margin: '10px 0',
  },
}));

const QuestionField = (props) => {
  const { onSubmit, open, onClose } = props;

  const [question, setQuestion] = useState({});

  const [onBlur, setBlur] = useState({});

  const [options, setOptions] = useState({});

  const handleBlur = (label) => {
    setBlur({ ...onBlur, [label]: true });
  };

  const handleClose = () => {
    onClose();
    setOptions({});
    setQuestion({});
  };

  const handleAddQuestion = () => {
    console.log(Object.values(options));
    console.log(question, 'check');
    onSubmit(question);
    handleClose();
  };

  const handleOptionField = (label, input) => {
    setOptions({ ...options, [label]: input.target.value });
  };

  const handleQuestionField = (label, input) => {
    setQuestion({
      ...question, [label]: input.target.value,
    });
  };

  useEffect(() => {
    setQuestion({
      ...question, options: (Object.values(options)),
    });
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

        <TextField
          size="small"
          fullWidth
          className={classes.margin}
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
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleClose} color="secondary">
          Close
        </Button>
        <Button autoFocus onClick={handleAddQuestion} color="primary">
          Add Question
        </Button>
      </DialogActions>
    </Dialog>
  );
};

QuestionField.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool,
};

QuestionField.defaultProps = {
  open: false,
};

export default QuestionField;
