import React, { useState } from 'react';
import {
  RadioGroup, FormControlLabel, Radio, Container, Typography, makeStyles, IconButton,
  Paper,
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { EditQuestion } from './Components/EditQuestion';
import { DeleteDialog } from './Components/DeleteDialog';

const useStyles = makeStyles((theme) => ({
  question: {
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
  },
  options: {
    marginLeft: theme.spacing(2),
  },
}));

const Exam = () => {
  const classes = useStyles();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [details, setDetails] = useState({});
  const handleEdit = (questionDetails) => {
    setEditOpen(true);
    setDetails(questionDetails);
  };

  const handleEditClose = () => {
    setEditOpen(false);
  };

  const handleEditSubmit = (newDetails) => {
    setEditOpen(false);
    console.log(newDetails);
  };

  const deleteOpenAndClose = (questionDetails) => {
    setDetails(questionDetails);
    setDeleteOpen(!deleteOpen);
  };

  const handleDelete = () => {
    setDeleteOpen(false);
    console.log(details);
  };

  const data = [{
    options: [
      'Gas only',
      'Liquid only',
      'Solid only',
      'Both solid & Liquid',
    ],
    _id: '602df0a87d1587135da88000',
    questionSet: '602defed287cf212e8bb3810',
    question: "Young's modulus is the property of ?",
    correctOption: 'Solid only',
    originalId: '602df0a87d1587135da88000',
    createdAt: '2021-02-18T04:44:24.651Z',
  },
  {
    options: [
      'Sitting position',
      'Standing position',
      'Lying position',
      'None of these',
    ],
    _id: '602df0a87d1587135da88001',
    questionSet: '602defed287cf212e8bb3810',
    question: 'A man presses more weigh on earth at?',
    correctOption: 'Standing position',
    originalId: '602df0a87d1587135da88001',
    createdAt: '2021-02-18T04:44:24.652Z',
    __v: 0,
  },
  {
    options: [
      'Concentration',
      'Size',
      'Density',
      'Time',
    ],
    _id: '60336ecbdfae445ccb34015c',
    questionSet: '602defed287cf212e8bb3810',
    question: "Svedberg's Unit is a unit of ______?",
    correctOption: 'Time',
    originalId: '602df0a87d1587135da87fff',
    createdAt: '2021-02-18T04:44:24.648Z',
  },
  ];

  return (
    <Container>
      {
        data.map((questionDetail) => (
          <Paper key={questionDetail.originalId} className={classes.question}>
            <Typography variant="h6">
              {questionDetail.question}
            </Typography>
            <Typography align="right">
              <IconButton disableFocusRipple size="small" onClick={() => handleEdit(questionDetail)}>
                <EditIcon />
              </IconButton>
              <IconButton disableFocusRipple size="small" onClick={() => deleteOpenAndClose(questionDetail)}>
                <DeleteIcon />
              </IconButton>
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
      <EditQuestion
        open={editOpen}
        defaultValues={details}
        onSubmit={handleEditSubmit}
        onClose={handleEditClose}
      />
      <DeleteDialog
        open={deleteOpen}
        onClose={deleteOpenAndClose}
        onDelete={handleDelete}
      />
    </Container>
  );
};

export default Exam;
