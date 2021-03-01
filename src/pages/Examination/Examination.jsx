import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { TableComponent } from '../../components';
import { AddExamination } from './Components/AddDialogue';
import { EditExamination } from './Components/EditDialogue';
import { DeleteExamination } from './Components/DeleteDialogue';

const Examination = (props) => {
  const { history, match } = props;
  const handleSelect = (property) => {
    history.push(`${match.path}/${property}`);
  };

  const [open, setOpen] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);

  const [editOpen, setEditOpen] = useState(false);

  const [details, setDetails] = useState({});

  const handleOpenAddExamination = () => {
    setOpen(!open);
  };

  const handleEditDialogOpen = (examDetails) => {
    setEditOpen(true);
    setDetails(examDetails);
  };

  const handleDeleteDialogOpen = (examDetails) => {
    setDeleteOpen(true);
    setDetails(examDetails);
  };

  const handleDeleteDialogClose = () => {
    setDeleteOpen(false);
  };

  const handleDeleteDialogSubmit = () => {
    setDeleteOpen(false);
    console.log(details);
  };

  const handleEditDialogClose = () => {
    setEditOpen(false);
  };

  const handleEditDialogSubmit = (editedDetails) => {
    setEditOpen(false);
    console.log(editedDetails);
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
          {
            field: 'description',
            label: 'Description',
          },
        ]}
        actions={[
          {
            icon: <EditIcon />,
            handler: handleEditDialogOpen,
          },
          {
            icon: <DeleteIcon />,
            handler: handleDeleteDialogOpen,
          },
        ]}
        onSelect={handleSelect}
      />
      <AddExamination
        open={open}
        onClose={handleOpenAddExamination}
      />
      <EditExamination
        open={editOpen}
        defaultValues={details}
        onClose={handleEditDialogClose}
        onSubmit={handleEditDialogSubmit}
      />
      <DeleteExamination
        open={deleteOpen}
        onClose={handleDeleteDialogClose}
        onDelete={handleDeleteDialogSubmit}
      />
    </>
  );
};

Examination.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

export default Examination;
