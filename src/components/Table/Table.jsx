import React from 'react';
import PropTypes from 'prop-types';
import {
  makeStyles, Table, TableCell, TableBody, TableContainer,
  TableHead, Paper, TableRow, Typography, TableSortLabel, TablePagination, IconButton,
} from '@material-ui/core';
import { StyledTableCell, StyledTableRow } from './style';

const useStyles = makeStyles({
  table: {
    margin: '10px 0px',
  },
});

const TableComponent = (props) => {
  const {
    id, data, columns, order, orderBy, onSort, onSelect,
    actions, count, page, rowsPerPage, onChangePage,
  } = props;
  const PaginationCell = () => (
    <TablePagination
      rowsPerPageOptions={[]}
      count={count}
      component="div"
      rowsPerPage={rowsPerPage}
      page={page}
      onChangePage={onChangePage}
    />
  );

  const classes = useStyles();

  return (
    <TableContainer className={classes.table} component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {
              columns.map((column) => (
                <StyledTableCell align={column.align} key={column.label}>
                  <TableSortLabel
                    hideSortIcon
                    active={orderBy === column.field}
                    direction={order}
                    onClick={() => onSort(column.field)}
                  >
                    <Typography variant="body2">
                      {column.label}
                    </Typography>
                  </TableSortLabel>
                </StyledTableCell>
              ))
            }
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((trainee, traineeIndex) => (
            <StyledTableRow key={trainee[id]}>
              {
                columns.map((column) => (
                  <TableCell key={`${trainee[id]}${column.field}`} align={column.align} onClick={() => onSelect(trainee[id])}>
                    <Typography>
                      {column.format
                        ? column.format(trainee[column.field]) : trainee[column.field]}
                    </Typography>
                  </TableCell>
                ))
              }
              <TableCell align="center" key={`${trainee[id]}${traineeIndex + 1}`}>
                {
                  actions.map((action, index) => (
                    <IconButton key={`${index + 1}`} disableFocusRipple size="small" onClick={() => action.handler(trainee)}>
                      {action.icon}
                    </IconButton>
                  ))
                }
              </TableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
      <PaginationCell />
    </TableContainer>
  );
};

TableComponent.propTypes = {
  id: PropTypes.string.isRequired,
  columns: PropTypes.arrayOf(Object).isRequired,
  data: PropTypes.arrayOf(Object).isRequired,
  order: PropTypes.string,
  orderBy: PropTypes.string,
  onSort: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  actions: PropTypes.arrayOf(Object),
  count: PropTypes.number,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  onChangePage: PropTypes.func.isRequired,
};

TableComponent.defaultProps = {
  order: 'asc',
  orderBy: '',
  actions: [],
  page: 0,
  count: 0,
  rowsPerPage: 100,
};

export default TableComponent;
