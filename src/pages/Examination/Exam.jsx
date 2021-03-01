import React from 'react';
import {
  FormControl, FormLabel, RadioGroup, FormControlLabel, Radio,
} from '@material-ui/core';

const Exam = () => {
  console.log('Inside Exam');
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
    <>
      {
        data.map((questionDetail) => (
          <>
            <FormControl component="fieldset">
              <FormLabel component="legend">{questionDetail.question}</FormLabel>
              <RadioGroup aria-label="answer" name="gender1">
                <FormControlLabel value={questionDetail} control={<Radio />} label="Female" />
              </RadioGroup>
            </FormControl>
          </>
        ))
      }
    </>
  );
};

export default Exam;
