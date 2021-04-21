import React from 'react';
import {
  render, cleanup, screen, waitFor,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { TextFieldDemo } from '..';

beforeEach(async () => {
  await waitFor(() => {
    render(
      <TextFieldDemo />,
    );
  });
});
afterEach(cleanup);

describe('Input demo test', () => {
  test('test for disabled text field', async () => {
    const element = screen.getAllByRole('textbox');
    expect(element[0]).toHaveProperty('disabled', true);
  });
});
