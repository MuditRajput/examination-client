import React from 'react';
import {
  render, cleanup, screen, waitFor, fireEvent,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { EditExamination } from './Components/EditDialog';

beforeEach(async () => {
  await waitFor(() => {
    render(
      <EditExamination
        open
        onSubmit={(details) => { console.log(details); }}
        onClose={() => {}}
        defaultValues={{
          subject: 'Subject',
          description: 'description',
          time: 30,
          maxAttempts: 5,
        }}
      />,
    );
  });
});
afterEach(cleanup);

describe('Edit Examination', () => {
  test('passed if add examination dialogue is rendered', () => {
    const element = screen.getByTestId('dialogText');
    expect(element).toHaveTextContent('Edit Examination');
  });
  test('passed if submit button is disabled initially', () => {
    const element = screen.getByTestId('editSubmit');
    expect(element).toHaveProperty('disabled', true);
  });
  test('submit button enabled when correct inputs', async () => {
    fireEvent.change(screen.getByRole('textbox', { name: 'Subject' }), { target: { value: 'Subject New' } });
    const element = screen.getByTestId('editSubmit');
    await waitFor(() => {
      expect(element).toHaveProperty('disabled', false);
    });
  });
  test('submit button enabled when correct inputs', async () => {
    fireEvent.change(screen.getByRole('textbox', { name: 'Subject' }), { target: { value: '' } });
    const element = screen.getByTestId('editSubmit');
    await waitFor(() => {
      expect(element).toHaveProperty('disabled', true);
    });
  });
  test('submit button enabled when correct inputs', async () => {
    fireEvent.change(screen.getByRole('textbox', { name: 'Subject' }), { target: { value: 'Subject New' } });
    const element = screen.getByTestId('editSubmit');
    await waitFor(() => {
      expect(element).toHaveProperty('disabled', false);
      fireEvent.click(element);
    });
  });
});
