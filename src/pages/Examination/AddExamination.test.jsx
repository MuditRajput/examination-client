import React from 'react';
import {
  render, cleanup, screen, fireEvent,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { AddExamination } from './Components/AddDialog';

beforeEach(() => {
  render(
    <AddExamination open onSubmit={(details) => { console.log(details); }} onClose={() => {}} />,
  );
});
afterEach(cleanup);

describe('Add Examination', () => {
  test('passed if add examination dialogue is rendered', () => {
    const element = screen.getByTestId('dialogText');
    expect(element).toHaveTextContent('Add Examination');
  });
  test('passed if submit button is disabled initially', () => {
    const element = screen.getByTestId('addSubmit');
    expect(element).toHaveProperty('disabled', true);
  });
  test('submit button enabled when correct inputs', async () => {
    fireEvent.change(screen.getByRole('textbox', { name: 'Subject' }), { target: { value: 'Subject' } });
    fireEvent.change(screen.getByRole('spinbutton', { name: 'Time (in minutes) Maximum number of attempts' }), { target: { value: 40 } });
    fireEvent.change(screen.getByRole('spinbutton', { name: '' }), { target: { value: 5 } });
    const element = screen.getByTestId('addSubmit');
    expect(element).toHaveProperty('disabled');
  });
  test('submit button disabled when wrong inputs', async () => {
    fireEvent.change(screen.getByRole('textbox', { name: 'Subject' }), { target: { value: 'Subject' } });
    fireEvent.change(screen.getByRole('spinbutton', { name: 'Time (in minutes) Maximum number of attempts' }), { target: { value: 40 } });
    fireEvent.change(screen.getByRole('spinbutton', { name: '' }), { target: { value: '@' } });
    const element = screen.getByTestId('addSubmit');
    expect(element).toHaveProperty('disabled', true);
  });
});
