import React from 'react';
import {
  render, cleanup, screen, fireEvent, waitFor,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { AddExamination } from './Components/AddDialog';

beforeEach(async () => {
  await waitFor(() => {
    render(
      <AddExamination open onSubmit={(details) => { console.log(details); }} onClose={() => {}} />,
    );
  });
});
afterEach(cleanup);

describe('Add Examination', () => {
  test('passed if add examination dialogue is rendered', async () => {
    const element = screen.getByTestId('dialogText');
    await waitFor(() => {
      expect(element).toHaveTextContent('Add Examination');
    });
  });
  test('passed if submit button is disabled initially', async () => {
    const element = screen.getByTestId('addSubmit');
    await waitFor(() => {
      expect(element).toHaveProperty('disabled', true);
    });
  });
  test('submit button enabled when correct inputs', async () => {
    fireEvent.change(screen.getByRole('textbox', { name: 'Subject' }), { target: { value: 'Subject' } });
    fireEvent.change(screen.getByRole('spinbutton', { name: 'Time (in minutes)' }), { target: { value: 40 } });
    fireEvent.change(screen.getByRole('spinbutton', { name: 'Maximum number of attempts' }), { target: { value: 5 } });
    const element = screen.getByTestId('addSubmit');
    await waitFor(() => {
      expect(element).toHaveProperty('disabled');
    });
  });
  test('submit button disabled when wrong inputs', async () => {
    fireEvent.change(screen.getByRole('textbox', { name: 'Subject' }), { target: { value: 'Subject' } });
    fireEvent.change(screen.getByRole('spinbutton', { name: 'Time (in minutes)' }), { target: { value: 40 } });
    fireEvent.change(screen.getByRole('spinbutton', { name: 'Maximum number of attempts' }), { target: { value: '@' } });
    const element = screen.getByTestId('addSubmit');
    await waitFor(() => {
      expect(element).toHaveProperty('disabled', true);
    });
  });
});
