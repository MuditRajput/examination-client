import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import { TableComponent } from '../../components';
import { AddExamination } from './Components/AddDialogue';
import { EditExamination } from './Components/EditDialogue';
import { DeleteDialog } from './Components/DeleteDialogue';

const Examination = (props) => {
  const { history, match } = props;
  const [open, setOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [details, setDetails] = useState({});
  const [order, setOrder] = useState();
  const [orderBy, setOrderBy] = useState();

  const handleOpenAddExamination = () => {
    setOpen(!open);
  };

  const handleAddExaminationSubmit = (examinationdetails) => {
    console.log(examinationdetails);
    setOpen(false);
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
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

  const handleSort = (property) => {
    setOrder(order === 'asc' && orderBy === property ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelect = (property) => {
    history.push(`${match.path}/${property}`);
  };

  const handleAddQuestions = (questionDetails) => {
    history.push(`${match.path}/add/${questionDetails.originalId}`);
  };

  const data = [
    {
      subject: 'physics',
      originalId: '602defed287cf212e8bb3810',
      description: 'Physics Exam for 11th class students',
    },
    {
      subject: 'physics',
      originalId: '602e47374547b575c3d12e00',
      description: 'Physics Exam for 12th class students',
    },
    {
      subject: 'chemistry',
      originalId: '602e5e3a157ce60417fadf33',
      description: 'Chemistry Exam for 11th class students',
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
          {
            icon: <AddIcon fontSize="large" />,
            handler: handleAddQuestions,
          },
        ]}
        onSelect={handleSelect}
        onSort={handleSort}
        onChangePage={handleChangePage}
        page={page}
      />
      <AddExamination
        open={open}
        onClose={handleOpenAddExamination}
        onSubmit={handleAddExaminationSubmit}
      />
      <EditExamination
        open={editOpen}
        defaultValues={details}
        onClose={handleEditDialogClose}
        onSubmit={handleEditDialogSubmit}
      />
      <DeleteDialog
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
