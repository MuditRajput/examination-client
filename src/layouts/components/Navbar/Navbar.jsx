import React from 'react';
import PropTypes from 'prop-types';
import {
  makeStyles, AppBar, Toolbar, Typography, Button,
} from '@material-ui/core';
import { NavLink } from 'react-router-dom';

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
    marginBottom: '20px',
  },
  menuButton: {
    color: 'white',
  },
  title: {
    flexGrow: 1,
  },
}));

const NavBar = (props) => {
  const { handleLogout } = props;
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Trainee Portal
          </Typography>
          <NavLink to="/trainee">
            <Button className={classes.menuButton}>TRAINEE</Button>
          </NavLink>
          <NavLink to="/text-field-demo">
            <Button className={classes.menuButton}>TEXTFIELD DEMO</Button>
          </NavLink>
          <NavLink to="/input-demo">
            <Button className={classes.menuButton}>INPUT DEMO</Button>
          </NavLink>
          <NavLink to="/children-demo">
            <Button className={classes.menuButton}>CHILDREN DEMO</Button>
          </NavLink>
          <NavLink to="/logout">
            <Button onClick={handleLogout} className={classes.menuButton} color="inherit">LOGOUT</Button>
          </NavLink>
        </Toolbar>
      </AppBar>
    </div>
  );
};

NavBar.propTypes = {
  handleLogout: PropTypes.func.isRequired,
};

export default NavBar;
