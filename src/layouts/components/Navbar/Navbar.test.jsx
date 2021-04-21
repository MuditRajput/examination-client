import React from 'react';
import {
  render, cleanup, screen,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from './Navbar';

beforeEach(() => {
  render(
    <Router>
      <Navbar handleLogout={() => {}} />
    </Router>,
  );
});
afterEach(cleanup);

describe('Nav Bar Test', () => {
  test('Navbar having all buttons', () => {
    const element = screen.getAllByRole('button');
    expect(element).toHaveLength(7);
  });
});
