import { makeStyles } from '@material-ui/core';

export const useStyles = makeStyles((theme) => ({
  question: {
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
  },
  options: {
    marginLeft: theme.spacing(2),
  },
  buttons: {
    marginBottom: theme.spacing(2),
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
  spacing: {
    margin: theme.spacing(2),
  },
  margin: {
    margin: '10px 0px',
  },
  optionsMargin: {
    margin: '10px 10px 10px 0px',
    width: '40%',
  },
  flexRow: {
    display: 'flex',
    alignContent: 'space-between',
    margin: '10px 0',
  },
  flexElements: {
    marginLeft: '15px',
  },
  marks: {
    position: 'absolute',
    right: '85px',
    display: 'inline-block',
  },
  instruction: {
    marginLeft: '8px',
    fontSize: '12px',
    color: 'grey',
  },
  correctOptionError: {
    marginLeft: theme.spacing(3),
    fontSize: '12px',
  },
}));
