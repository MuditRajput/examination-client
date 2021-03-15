import React, { useState } from 'react';
import PropTypes from 'prop-types';
import readXlsxFile from 'read-excel-file';
import { Button } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import PublishIcon from '@material-ui/icons/Publish';
import DeleteIcon from '@material-ui/icons/Delete';
import { useQuery, useMutation } from '@apollo/client';
import AddIcon from '@material-ui/icons/Add';
import { TableComponent, withLoaderAndMessage } from '../../components';
import { AddExamination } from './Components/AddDialog';
import { EditExamination } from './Components/EditDialog';
import { DeleteDialog } from './Components/DeleteDialog';
import { ConfirmDialog } from './Components/ConfirmDialog';
import { GETALL_EXAMINATION } from './query';
import {
  CREATE_EXAMINATION, UPDATE_EXAMINATION, DELETE_EXAMINATION, ADD_QUESTIONS,
} from './mutation';
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
  const [questionList, setQuestionList] = useState([]);
  const [confirmAdd, setConfirmAdd] = useState(false);

  const {
    data, loading: getAllExaminationLoading, refetch,
  } = useQuery(GETALL_EXAMINATION, { variables: {}, fetchPolicy: 'network-only' });
  const EnhancedTable = withLoaderAndMessage(TableComponent);
  let examinations = [];
  let write = false;
  if (!getAllExaminationLoading && !examinations.length) {
    const { getAllExamination: { data: Exams = [], write: writePermission = false } = {} } = data;
    examinations = Exams;
    write = writePermission;
  }

  const [createExamination] = useMutation(CREATE_EXAMINATION);
  const [updateExamination] = useMutation(UPDATE_EXAMINATION);
  const [deleteExamination] = useMutation(DELETE_EXAMINATION);
  const [createQuestions] = useMutation(ADD_QUESTIONS);

  const handleOpenAddExamination = () => {
    setOpen(!open);
  };

  const closeConfirm = () => {
    setDetails({});
    setConfirmAdd(false);
  };

  const submitConfirm = async (openSnackbar) => {
    try {
      const variables = { originalId: details.originalId, questionList };
      const response = await createQuestions({
        variables,
      });
      const {
        data: { createQuestions: { message, status, data: responseData } = {} } = {},
      } = response;
      if (responseData) {
        openSnackbar(status, message);
        closeConfirm();
      } else {
        openSnackbar('error', message);
      }
    } catch {
      openSnackbar('error', 'Something went wrong');
    }
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
    localStorage.setItem('maxAttempts', (examinations.find((exam) => exam.originalId === property)).maxAttempts);
    history.push(`${match.path}/${property}`);
    localStorage.setItem('time', (examinations.find((exam) => exam.originalId === property)).time);
  };

  const handleAddQuestions = (questionDetails) => {
    history.push(`${match.path}/add/${questionDetails.originalId}`);
  };

  const handleFileUploadDetails = (examDetails) => {
    if (!Object.keys(details).length) {
      setDetails(examDetails);
    }
  };

  const handleFileUpload = (input, openSnackbar) => {
    const file = input.target.files[0];
    readXlsxFile(file).then((sheets) => {
      const questions = [];
      sheets.forEach((sheet, index) => {
        const [question, correctOption, ...rest] = sheet;
        if (!question || !correctOption) {
          openSnackbar('error', `File is missing required field at ${index + 1} line`);
        }
        const options = [];
        rest.forEach((option) => {
          if (option) {
            options.push(`${option}`);
          }
        });
        questions.push(
          {
            question,
            correctOption: `${correctOption}`,
            options,
          },
        );
      });
      setQuestionList(questions);
      setConfirmAdd(true);
    }).catch(() => {
      openSnackbar('error', 'File Parse Error');
    });
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
              {
                field: 'time',
                label: 'Time',
                format: (value) => value && `${value} Minutes`,

              },
              {
                field: 'maxAttempts',
                label: 'Maximum Attempts',
              },
            ]}
            actions={write ? [
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
              {
                icon:
              <label htmlFor="fileInput" style={{ display: 'table' }}>
                <PublishIcon />
                <input
                  style={{ display: 'none' }}
                  onChange={(input) => handleFileUpload(input, openSnackbar)}
                  type="file"
                  size="60"
                  id="fileInput"
                />
              </label>,
                handler: handleFileUploadDetails,
              },
            ] : []}
            onSelect={handleSelect}
            onSort={handleSort}
            onChangePage={handleChangePage}
            page={page}
          />
          <AddExamination
            open={open}
            onClose={handleOpenAddExamination}
            onSubmit={(event) => handleAddExaminationSubmit(event, openSnackbar)}
          />
          <EditExamination
            open={editOpen}
            defaultValues={details}
            onClose={handleEditDialogClose}
            onSubmit={(event) => handleEditDialogSubmit(event, openSnackbar)}
          />
          <DeleteDialog
            open={deleteOpen}
            onClose={handleDeleteDialogClose}
            onDelete={() => handleDeleteDialogSubmit(openSnackbar)}
          />
          <ConfirmDialog
            open={confirmAdd}
            onClose={closeConfirm}
            onSubmit={() => submitConfirm(openSnackbar)}
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
