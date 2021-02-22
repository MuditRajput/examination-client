import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#8564a4',
      main: '#573975',
      dark: '#2b1149',
      contrastText: '#fff',
    },
    secondary: {
      light: '#ff6659',
      main: '#d32f2f',
      dark: '#9a0007',
      contrastText: '#000',
    },
  },
  typography: {
    fontFamily: [
      'sans-serif',
      'cursive',
      'Comic Sans MS',
    ],
    fontSize: 13,
  },
});

export default theme;
