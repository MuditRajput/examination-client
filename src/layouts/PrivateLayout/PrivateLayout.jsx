import React from 'react';
import PropTypes from 'prop-types';
import { NavBar } from '../components';

const handleLogout = () => {
  localStorage.removeItem('token');
};

const PrivateLayout = ({ children }) => (
  <>
    <NavBar
      handleLogout={handleLogout}
    />
    <div className="main">{children}</div>
  </>
);

PrivateLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PrivateLayout;
