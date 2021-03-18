import { makeStyles } from '@material-ui/core';

export const useStyles = makeStyles((theme) => ({
  buttonBack: {
    margin: '10px',
  },
  question: {
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
  },
  options: {
    marginLeft: theme.spacing(2),
  },
  resultOption: {
    background: '#efefef',
    padding: '10px',
    marginTop: '10px',
  },
  correctOption: {
    borderRadius: '3px',
    background: '#98de8b80',
  },
  wrongOption: {
    borderRadius: '3px',
    background: '#eec5c5',
  },
  table: {
    margin: '10px 0px',
  },
  rowHover: {
    '&:hover': {
      backgroundColor: theme.palette.action.disabledBackground,
      cursor: 'pointer',
    },
  },
}
));
