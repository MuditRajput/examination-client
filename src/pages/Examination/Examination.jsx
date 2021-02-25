import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@material-ui/core';
import { TableComponent } from '../../components';
import { AddExamination } from './Components/AddDialogue';

const Examination = (props) => {
  const { history, match } = props;
  const handleSelect = (property) => {
    history.push(`${match.path}/${property}`);
  };

  const [open, setOpen] = useState(false);

  const handleOpenAddExamination = () => {
    setOpen(!open);
  };

  const data = [
    {
      subject: 'physics',
      originalId: '602defed287cf212e8bb3810',
    },
    {
      subject: 'physics',
      originalId: '602e47374547b575c3d12e00',
    },
    {
      subject: 'chemistry',
      originalId: '602e5e3a157ce60417fadf33',
    },
  ];
  return (
    <>
      <Button size="large" variant="outlined" color="primary" onClick={handleOpenAddExamination}>
        Add Examination
      </Button>
      <TableComponent
        id="originalId"
        data={data}
        columns={[
          {
            field: 'subject',
            label: 'Examination',
          },
        ]}
        onSelect={handleSelect}
      />
      <AddExamination
        open={open}
        onClose={handleOpenAddExamination}
      />
    </>
  );
};

Examination.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

export default Examination;
