import React from 'react';
import {
  render, cleanup, screen, waitFor, fireEvent,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { InputDemo } from '..';

beforeEach(async () => {
  await waitFor(() => {
    render(
      <InputDemo />,
    );
  });
});
afterEach(cleanup);

describe('Input demo test', () => {
  test('text field value check', async () => {
    const element = screen.getByRole('textbox');
    fireEvent.change(element, { target: { value: 'Name Test' } });
    const errorText = screen.getByTestId('error');
    await waitFor(() => {
      expect(errorText).not.toHaveTextContent();
    });
  });
  test('text field value check with correct values', async () => {
    const element = screen.getByRole('textbox');
    fireEvent.change(element, { target: { value: '' } });
    const errorText = screen.getAllByTestId('error');
    const submitButton = screen.getByRole('button', { name: 'Submit' });
    await waitFor(() => {
      expect(errorText).toHaveLength(1);
      expect(submitButton).toHaveProperty('disabled', true);
    });
  });
  test('test for options', () => {
    const element = screen.getAllByTestId('options');
    expect(element).toHaveLength(2);
  });
  test('text field value check with error', async () => {
    const element = screen.getByRole('textbox');
    fireEvent.change(element, { target: { value: '' } });
    const submitButton = screen.getByRole('button', { name: 'Submit' });
    await waitFor(() => {
      expect(submitButton).toHaveProperty('disabled', true);
    });
  });
});
