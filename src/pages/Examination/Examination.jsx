import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { useQuery, useMutation } from '@apollo/client';
import AddIcon from '@material-ui/icons/Add';
import { TableComponent, withLoaderAndMessage } from '../../components';
import { AddExamination } from './Components/AddDialog';
import { EditExamination } from './Components/EditDialog';
import { DeleteDialog } from './Components/DeleteDialog';
import { GETALL_EXAMINATION } from './query';
import { CREATE_EXAMINATION, UPDATE_EXAMINATION, DELETE_EXAMINATION } from './mutation';
import { SnackbarContext } from '../../contexts';

const Examination = (props) => {
  const { history, match } = props;
  const [open, setOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [details, setDetails] = useState({});
  const [order, setOrder] = useState();
  const [orderBy, setOrderBy] = useState();

  const {
    data, loading: getAllExaminationLoading, refetch,
  } = useQuery(GETALL_EXAMINATION, { variables: {}, fetchPolicy: 'network-only' });
  const EnhancedTable = withLoaderAndMessage(TableComponent);
  let examinations = [];
  if (!getAllExaminationLoading && !examinations.length) {
    const { getAllExamination: { data: Exams = [] } = {} } = data;
    examinations = Exams;
  }

  const [createExamination] = useMutation(CREATE_EXAMINATION);
  const [updateExamination] = useMutation(UPDATE_EXAMINATION);
  const [deleteExamination] = useMutation(DELETE_EXAMINATION);

  const handleOpenAddExamination = () => {
    setOpen(!open);
  };

  const handleAddExaminationSubmit = async (examinationDetails, openSnackbar) => {
    try {
      const response = await createExamination({ variables: examinationDetails });
      const {
        data: { createExamination: { message, status, data: responseData } = {} } = {},
      } = response;
      if (responseData) {
        refetch();
        openSnackbar(status, message);
        setOpen(false);
      } else {
        openSnackbar('error', message);
      }
    } catch {
      openSnackbar('error', 'Something went wrong');
    }
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

  const handleDeleteDialogSubmit = async (openSnackbar) => {
    try {
      const response = await deleteExamination({ variables: { id: details.originalId } });
      const {
        data: { deleteExamination: { message, status } = {} } = {},
      } = response;
      if (status === 'success') {
        refetch();
        openSnackbar(status, message);
        setDeleteOpen(false);
      } else {
        openSnackbar('error', message);
      }
    } catch {
      openSnackbar('error', 'Something went wrong');
    }
  };

  const handleEditDialogClose = () => {
    setEditOpen(false);
  };

  const handleEditDialogSubmit = async (editedDetails, openSnackbar) => {
    try {
      const response = await updateExamination({
        variables: { originalId: details.originalId, ...editedDetails },
      });
      const {
        data: { updateExamination: { message, status, data: responseData } = {} } = {},
      } = response;
      if (responseData) {
        refetch();
        openSnackbar(status, message);
        setEditOpen(false);
      } else {
        openSnackbar('error', message);
      }
    } catch {
      openSnackbar('error', 'Something went wrong');
    }
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

  return (
    <SnackbarContext.Consumer>
      {({ openSnackbar }) => (
        <>
          <Button size="large" variant="outlined" color="primary" onClick={handleOpenAddExamination}>
            Add Examination
          </Button>
          <EnhancedTable
            id="originalId"
            loader={getAllExaminationLoading}
            data={examinations}
            dataLength={examinations.length}
            columns={[
              {
                field: 'subject',
                label: 'Examination',
              },
              {
                field: 'description',
                label: 'Description',
              },
              {
                field: 'maximumMarks',
                label: 'Maximum Marks',
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
            onSubmit={(input) => handleAddExaminationSubmit(input, openSnackbar)}
          />
          <EditExamination
            open={editOpen}
            defaultValues={details}
            onClose={handleEditDialogClose}
            onSubmit={(input) => handleEditDialogSubmit(input, openSnackbar)}
          />
          <DeleteDialog
            open={deleteOpen}
            onClose={handleDeleteDialogClose}
            onDelete={() => handleDeleteDialogSubmit(openSnackbar)}
          />
        </>
      )}
    </SnackbarContext.Consumer>
  );
};

Examination.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

export default Examination;
