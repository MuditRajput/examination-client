import React, { useEffect, useState } from 'react';
import * as yup from 'yup';
import {
  TextField, SelectField, RadioGroup, Button,
} from '../../components';
import {
  selectOptions, radioOptionsCricket, radioOptionsFootball,
} from '../../configs/Constants';

const InputDemo = () => {
  const schema = yup.object().shape({
    name: yup.string().required('name is required').min(3, 'should have more then 3 characters'),
    sport: yup.string().required('sport is required'),
    cricket: yup.string().when('sport', { is: 'cricket', then: yup.string().required('What you do is required') }),
    football: yup.string().when('sport', { is: 'football', then: yup.string().required('What you do is required') }),
  });
  const [state, setstate] = useState({
    name: '', sport: '', cricket: '', football: '',
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

  const hasErrors = () => Object.keys(schemaErrors).length !== 0;

  const isTouched = () => Object.keys(onBlur).length !== 0;

  const handleTextField = (input) => {
    setstate({
      ...state, name: input.target.value,
    });
  };

  const handleSelectField = (input) => {
    if (input.target.value === 'select') {
      setstate({
        ...state, sport: '', cricket: '', football: '',
      });
      return;
    }
    setstate({
      ...state, sport: input.target.value, cricket: '', football: '',
    });
  };

  const handleRadioGroup = (input) => {
    setstate({ ...state, [state.sport]: input.target.value });
  };

  useEffect(() => {
    console.log(state, onBlur);
    handleValidate();
  }, [state]);

  const onSubmit = () => {
    console.log(state);
  };

  const resetState = () => {
    setstate({
      name: '', sport: '', cricket: '', football: '',
    });
  };

  const radioOptions = () => {
    const options = {
      cricket: radioOptionsCricket,
      football: radioOptionsFootball,
    };
    return options[state.sport];
  };

  const selectedSport = state[state.sport];

  return (
    <div>
      <p>Name</p>
      <TextField defaultValue="" onChange={handleTextField} onBlur={() => handleBlur('name')} error={getError('name')} />
      <p>Sport</p>
      <SelectField
        options={selectOptions}
        onChange={handleSelectField}
        onBlur={() => handleBlur('sport')}
        error={getError('sport')}
      />
      {
        (state.sport)
          ? (
            <>
              <p>What You Do?</p>
              <RadioGroup value={selectedSport} options={radioOptions()} onChange={handleRadioGroup} onBlur={() => handleBlur(`${state.sport}`)} error={getError(`${state.sport}`)} />
            </>
          )
          : ''
      }
      <Button
        value="Cancel"
        onClick={resetState}
      />
      <Button
        value="Submit"
        onClick={onSubmit}
        disabled={!isTouched() || hasErrors()}
        colored={!(!isTouched() || hasErrors())}
      />
    </div>
  );
};

export default InputDemo;
