import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, CssBaseline } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import moment from 'moment';
import { useQuery, useMutation } from '@apollo/client';
import { AddDialog, EditDialog, DeleteDialog } from './Components';
import { TableComponent, withLoaderAndMessage } from '../../components';
import { SnackbarContext } from '../../contexts';
import { limit } from '../../configs/Constants';
import { GETALL_TRAINEES } from './query';
import { CREATE_TRAINEE, UPDATE_TRAINEE, DELETE_TRAINEE } from './mutation';
import { TRAINEE_UPDATED, TRAINEE_DELETED, TRAINEE_ADDED } from './subscription';

const TraineeList = (props) => {
  const { match, history } = props;
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [order, setOrder] = useState();
  const [orderBy, setOrderBy] = useState();
  const [page, setPage] = useState(0);
  const [details, setDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const skip = page * limit;

  const {
    subscribeToMore, data, loading: getAllTraineeLoading,
  } = useQuery(GETALL_TRAINEES, {
    variables: {
      skip,
      limit,
      sortBy: orderBy,
      sortOrder: order,
    },
    fetchPolicy: 'cache-and-network',
  });

  let trainees = [];
  let traineeCount = 0;
  if (!getAllTraineeLoading) {
    try {
      const {
        getAllTrainees: { data: { UsersList = [], totalCount = 0 } = {} } = {},
      } = data;
      trainees = UsersList;
      traineeCount = totalCount;
    } catch {
      trainees = [];
      traineeCount = 0;
    }
  }

  const [createTrainee] = useMutation(CREATE_TRAINEE);
  const [updateTrainee] = useMutation(UPDATE_TRAINEE);
  const [deleteTrainee] = useMutation(DELETE_TRAINEE);

  const EnhancedTable = withLoaderAndMessage(TableComponent);

  useEffect(() => {
    subscribeToMore({
      document: TRAINEE_UPDATED,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const { getAllTrainees: { data: { UsersList } = {} } = {} } = prev;
        const { data: { traineeUpdated: { data: newTrainee } = {} } = {} } = subscriptionData;
        const newList = UsersList.map((trainee) => {
          if (trainee.originalId === newTrainee.originalId) {
            return {
              ...trainee,
              ...newTrainee,
            };
          }
          return trainee;
        });
        return {
          getAllTrainees: {
            ...prev,
            data: {
              UsersList: newList,
            },
          },
        };
      },
    });
    subscribeToMore({
      document: TRAINEE_DELETED,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const { getAllTrainees: { data: { UsersList = [], totalCount = 0 } } = {} } = prev;
        const newList = UsersList.map((trainee) => {
          if (trainee.originalId === details.originalId) {
            return {};
          }
          return trainee;
        });
        return {
          getAllTrainees: {
            ...prev,
            data: {
              UsersList: newList,
              totalCount: totalCount - 1,
            },
          },
        };
      },
    });
    subscribeToMore({
      document: TRAINEE_ADDED,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const { getAllTrainees: { data: { UsersList, totalCount } = {} } = {} } = prev;
        const { data: { traineeAdded: { data: newTrainee } = {} } = {} } = subscriptionData;
        const newList = [newTrainee, ...UsersList];
        return {
          getAllTrainees: {
            ...prev,
            data: {
              UsersList: newList,
              totalCount: totalCount + 1,
            },
          },
        };
      },
    });
  }, []);

  const handleSort = (property) => {
    setOrder(order === 'asc' && orderBy === property ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelect = (property) => {
    history.push(`${match.path}/${property}`);
  };

  const handleOpenAddTrainee = () => {
    setOpen(!open);
  };

  const handleSubmit = async (openSnackbar, state) => {
    setLoading(true);
    console.log(state);
    const { name, email, password } = state;
    try {
      const response = await createTrainee({ variables: { name, email, password } });
      const { data: { createTrainee: { message, status } = {} } = {} } = response;
      if (status === 'success') {
        openSnackbar(status, message);
        setOpen(false);
      } else {
        openSnackbar('error', message);
      }
      setLoading(false);
    } catch {
      setLoading(false);
      openSnackbar('error', 'Something Went Wrong');
    }
  };

  const getDateFormatted = (date) => moment(date).format('dddd, MMMM Do yyyy, hh:mm:ss a');

  const handleEditDialogOpen = (traineeDetails) => {
    setEditOpen(true);
    setDetails(traineeDetails);
  };

  const handleDeleteDialogOpen = (traineeDetails) => {
    setDeleteOpen(true);
    setDetails(traineeDetails);
  };

  const handleEditDialogClose = () => {
    setEditOpen(false);
  };

  const handleEditDialogSubmit = async (openSnackbar, state) => {
    setLoading(true);
    console.log(state);
    const { originalId } = details;
    const { email, name } = state;
    try {
      const response = await updateTrainee({ variables: { id: originalId, email, name } });
      const { data: { updateTrainee: { message = '', status = '' } = {} } = {} } = response;
      if (status === 'success') {
        openSnackbar(status, message);
        setEditOpen(false);
      } else {
        openSnackbar('error', message);
      }
      setLoading(false);
    } catch {
      setLoading(false);
      openSnackbar('error', 'Something Went Wrong');
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleDeleteClose = () => {
    setDeleteOpen(false);
  };

  const handleDelete = async (openSnackbar) => {
    setLoading(true);
    console.log(details);
    const { originalId } = details;
    if (details.createdAt <= '2019-02-14') {
      openSnackbar('error', 'Trainee cannot be Deleted');
    } else {
      try {
        const response = await deleteTrainee({ variables: { id: originalId } });
        const { data: { deleteTrainee: { message = {}, status = {} } = {} } = {} } = response;
        if (status === 'success') {
          openSnackbar(status, message);
          setEditOpen(false);
        } else {
          openSnackbar('error', message);
        }
        setLoading(false);
        if (page > 0 && trainees.length === 1) {
          setPage(page - 1);
        }
      } catch {
        openSnackbar('error', 'Something Went Wrong');
      }
    }
    setDeleteOpen(false);
  };

  return (
    <SnackbarContext.Consumer>
      {({ openSnackbar }) => (
        <>
          <CssBaseline />
          <Button size="large" variant="outlined" color="primary" onClick={handleOpenAddTrainee}>
            Add Trainee
          </Button>
          <EnhancedTable
            id="originalId"
            data={trainees}
            loader={getAllTraineeLoading}
            dataLength={traineeCount}
            columns={[
              {
                field: 'name',
                label: 'Name',
              },
              {
                field: 'email',
                label: 'Email Address',
                format: (value) => value && value.toUpperCase(),
              },
              {
                field: 'createdAt',
                label: 'Date',
                align: 'right',
                format: getDateFormatted,
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
            order={order}
            orderBy={orderBy}
            onSort={handleSort}
            onSelect={handleSelect}
            page={page}
            onChangePage={handleChangePage}
            count={traineeCount}
            rowsPerPage={limit}

          />
          <AddDialog
            open={open}
            loading={loading}
            onClose={handleOpenAddTrainee}
            onSubmit={(addTraineeState) => handleSubmit(openSnackbar, addTraineeState)}
          />
          <EditDialog
            open={editOpen}
            loading={loading}
            onClose={handleEditDialogClose}
            onSubmit={(editTraineeState) => handleEditDialogSubmit(openSnackbar, editTraineeState)}
            defaultValues={details}
          />
          <DeleteDialog
            open={deleteOpen}
            loading={loading}
            onClose={handleDeleteClose}
            onDelete={() => handleDelete(openSnackbar)}
          />
        </>
      )}
    </SnackbarContext.Consumer>
  );
};

TraineeList.propTypes = {
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default TraineeList;
