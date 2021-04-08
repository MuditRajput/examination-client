import React from 'react';
import {
  render, cleanup, screen, fireEvent,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { DeleteDialog } from './pages/Trainee/Components/DeleteDialog';

beforeEach(() => {
  render(
    <DeleteDialog onDelete={() => { console.log('deleted'); }} onClose={() => { console.log('closed'); }} open />,
  );
});
afterEach(cleanup);

describe('Delete Dialog', () => {
  test('passed if delete dialog is rendered', () => {
    const element = screen.getAllByTestId('deleteDialog');
    expect(element).toHaveLength(1);
  });
  test('Delete button working', () => {
    const element = screen.getByTestId('deleteButton');
    fireEvent.click(element);
    expect(element).toHaveProperty('disabled', false);
  });
  test('close button working', () => {
    const element = screen.getByTestId('deleteClose');
    fireEvent.click(element);
    expect(element).toHaveProperty('disabled', false);
  });
});
