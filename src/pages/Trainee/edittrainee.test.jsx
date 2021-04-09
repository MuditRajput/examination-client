import React from 'react';
import {
  render, cleanup, screen, waitFor,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { EditDialog } from './Components/EditDialog';

const defaultValues = {
  email: 'email@successive.tech',
  name: 'Trainee Name',
};

beforeEach(async () => {
  await waitFor(() => {
    render(
      <EditDialog onSubmit={() => { console.log('edited successfully'); }} onClose={() => {}} open defaultValues={defaultValues} />,
    );
  });
});
afterEach(cleanup);

describe('Edit Dialog', () => {
  test('passed if edit dialog is rendered', async () => {
    const element = screen.getAllByTestId('editDialog');
    expect(element).toHaveLength(1);
  });
  test('submit button is disabled initially', () => {
    const element = screen.getByTestId('EditSubmit');
    expect(element).toHaveProperty('disabled', true);
  });
});
