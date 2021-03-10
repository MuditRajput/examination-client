import React from 'react';
import { ThemeProvider, CssBaseline } from '@material-ui/core';
import { BrowserRouter as Router, Switch, Redirect } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import { AuthRoute, PrivateRoute } from './routes';
import {
  ChildrenDemo, TextFieldDemo, InputDemo, LoginUi, AddQuestion,
  NoMatch, TraineeDetail, TraineeList, Examination, Exam, Results,
} from './pages';
import theme from './theme';
import { SnackBarProvider } from './contexts';
import apolloClient from './lib/apollo-client';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <SnackBarProvider>
        <ApolloProvider client={apolloClient}>
          <CssBaseline />
          <Router>
            <Switch>
              <Redirect exact path="/" to="/trainee" />
              <AuthRoute exact path="/login" component={LoginUi} />
              <PrivateRoute exact path="/exam" component={Examination} />
              <PrivateRoute exact path="/results" component={Results} />
              <PrivateRoute exact path="/exam/add/:id" component={AddQuestion} />
              <PrivateRoute path="/exam/:id" component={Exam} />
              <PrivateRoute exact path="/trainee" component={TraineeList} />
              <PrivateRoute exact path="/trainee/:id" component={TraineeDetail} />
              <PrivateRoute exact path="/input-demo" component={InputDemo} />
              <PrivateRoute exact path="/text-field-demo" component={TextFieldDemo} />
              <PrivateRoute exact path="/children-demo" component={ChildrenDemo} />
              <PrivateRoute default component={NoMatch} />
            </Switch>
          </Router>
        </ApolloProvider>
      </SnackBarProvider>
    </ThemeProvider>
  );
}

export default App;
