import React from 'react';
import PropTypes from 'prop-types';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import { useQuery } from '@apollo/client';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import moment from 'moment';
import { Typography, TableContainer, Paper } from '@material-ui/core';
import { GETALL_RESULTS } from './query';
import { useStyles } from './style';

const Results = ({ history }) => {
  const classes = useStyles();
  const marks = [];
  const maximumMarks = [];
  const {
    data, loading,
  } = useQuery(GETALL_RESULTS, {
    fetchPolicy: 'network-only',
  });
  let results = [];

  if (!loading && !results.length) {
    if (data.getAllResult.data) {
      const { getAllResult: { data: resultList = [] } = {} } = data;
      results = resultList;
      resultList.forEach(({ result }) => {
        let obtainedMarks = 0;
        let totalMarks = 0;
        Object.values(result).forEach((resultValue) => {
          obtainedMarks += Number(resultValue[0]);
          console.log(resultValue);
          totalMarks += Number(resultValue[3]);
        });
        marks.push(obtainedMarks);
        maximumMarks.push(totalMarks);
      });
    }
  }

  const goToDetail = (id) => {
    history.push(`/results/${id}`);
  };

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
              <TableRow
                onClick={() => goToDetail(result.originalId)}
                className={classes.rowHover}
                key={result.originalId}
              >
                <TableCell>{result.questionSet}</TableCell>
                <TableCell>{getDateFormatted(result.createdAt)}</TableCell>
                <TableCell align="right">
                  <Typography>
                    {marks[index]}
                    /
                    {maximumMarks[index]}
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

Results.propTypes = {
  history: PropTypes.object.isRequired,
};

export default Results;
