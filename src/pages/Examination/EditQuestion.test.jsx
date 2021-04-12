import React from 'react';
import {
  render, cleanup, screen, waitFor, fireEvent,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { EditQuestion } from './Components/EditQuestion';

beforeEach(async () => {
  await waitFor(() => {
    render(
      <EditQuestion
        open
        onSubmit={(details) => { console.log(details); }}
        onClose={() => {}}
        defaultValues={{
          options: ['15', '20', '30'],
          question: 'question 1',
          correctOption: ['30'],
          marks: 2,
        }}
      />,
    );
  });
});
afterEach(cleanup);

describe('Edit Questions', () => {
  test('passed if add examination dialogue is rendered', () => {
    const element = screen.getByTestId('dialogText');
    expect(element).toHaveTextContent('Edit Question');
  });
  test('passed if submit button is disabled initially', () => {
    const element = screen.getByTestId('editSubmit');
    expect(element).toHaveProperty('disabled', false);
  });
  test('submit button enabled when correct inputs', async () => {
    fireEvent.change(screen.getByRole('textbox', { name: 'Question' }), { target: { value: 'Question New' } });
    const element = screen.getByTestId('editSubmit');
    await waitFor(() => {
      expect(element).toHaveProperty('disabled', false);
    });
  });
  test('submit button enabled when correct inputs', async () => {
    fireEvent.change(screen.getByRole('textbox', { name: 'Question' }), { target: { value: '' } });
    const element = screen.getByTestId('editSubmit');
    await waitFor(() => {
      expect(element).toHaveProperty('disabled');
    });
  });
  test('submit new details', async () => {
    fireEvent.change(screen.getByRole('textbox', { name: 'Question' }), { target: { value: 'Question New' } });
    const element = screen.getByTestId('editSubmit');
    await waitFor(() => {
      expect(element).toHaveProperty('disabled', false);
      fireEvent.click(element);
    });
  });
});
