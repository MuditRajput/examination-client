import { withStyles, TableCell, TableRow } from '@material-ui/core';

export const StyledTableCell = withStyles(() => ({
  root: {
    color: '#8b8b8b',
  },
}))(TableCell);

export const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    '&:hover': {
      backgroundColor: theme.palette.action.disabledBackground,
      cursor: 'pointer',
    },
  },
}))(TableRow);
