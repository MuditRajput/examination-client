import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import { useQuery } from '@apollo/client';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import moment from 'moment';
import { Typography, TableContainer, Paper } from '@material-ui/core';
import { GETALL_RESULTS } from './query';

const useStyles = makeStyles((theme) => ({
  table: {
    margin: '10px 0px',
  },
  rowHover: {
    '&:hover': {
      backgroundColor: theme.palette.action.disabledBackground,
      cursor: 'pointer',
    },
  },
}));

const Results = () => {
  const classes = useStyles();
  const marks = [];
  const {
    data, loading,
  } = useQuery(GETALL_RESULTS, {
    fetchPolicy: 'network-only',
  });
  let results = [];

  if (!loading && !results.length) {
    if (data.getAllResult.data.length) {
      const { getAllResult: { data: resultList = [] } = {} } = data;
      results = resultList;
      resultList.forEach((result) => {
        const resultValues = Object.values(result.result);
        const correctValues = resultValues.filter((value) => (value || ''));
        marks.push(correctValues.length);
      });
    }
  }
  const getDateFormatted = (date) => moment(date).format('dddd, MMMM Do yyyy, hh:mm:ss a');
  return (
    <>
      <Typography variant="h5" color="primary" gutterBottom>
        Recent Exams
      </Typography>
      <TableContainer className={classes.table} component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography>
                  Examination Name
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>
                  Date Attempted
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography>
                  Marks Obtained
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {results.map((result, index) => (
              <TableRow className={classes.rowHover} key={result.id}>
                <TableCell>{result.questionSet}</TableCell>
                <TableCell>{getDateFormatted(result.createdAt)}</TableCell>
                <TableCell align="right">
                  <Typography>
                    {marks[index]}
                    /
                    {Object.keys(results).length}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default Results;
