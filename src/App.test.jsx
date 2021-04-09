import { render, waitFor } from '@testing-library/react';
import React from 'react';
import App from './App';

test('renders learn react link', async () => {
  await waitFor(() => {
    render(<App />);
  });
});
