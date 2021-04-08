import React from 'react';
import {
  render, cleanup, screen, fireEvent,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { ApolloProvider } from '@apollo/client';
import { SnackBarProvider } from './contexts';
import { TraineeList } from './pages';
import apolloClient from './lib/apollo-client';

beforeEach(() => {
  render(
    <ApolloProvider client={apolloClient}>
      <SnackBarProvider>
        <TraineeList match={{ path: 'trainee' }} history={{ push: '' }} />
      </SnackBarProvider>
    </ApolloProvider>,
  );
});
afterEach(cleanup);

describe('Rendering', () => {
  test('passed if add button is rendered', () => {
    const element = screen.getAllByTestId('addButton');
    expect(element).toHaveLength(1);
  });
  test('passed if add dialogue is rendered', () => {
    fireEvent.click(screen.getByTestId('addButton'));
    const element = screen.getByTestId('dialogText');
    expect(element).toHaveTextContent('Add Trainee');
  });
  test('passed if submit button is disabled initially', () => {
    fireEvent.click(screen.getByTestId('addButton'));
    const element = screen.getByTestId('addSubmit');
    expect(element).toHaveProperty('disabled');
  });
  test('submit button enabled when correct inputs', async () => {
    fireEvent.click(screen.getByTestId('addButton'));
    fireEvent.change(screen.getByRole('textbox', { name: 'Name' }), { target: { value: 'Trainee Test' } });
    const input = screen.getAllByRole('textbox', { name: '' });
    fireEvent.change(input[0], { target: { value: 'a@b.c' } });
    fireEvent.change(input[1], { target: { value: 'Qwerty@1' } });
    fireEvent.change(input[2], { target: { value: 'Qwerty@1' } });
    const element = screen.getByTestId('addSubmit');
    expect(element).not.toHaveProperty('true');
  });
  test('submit button disabled when wrong inputs', async () => {
    fireEvent.click(screen.getByTestId('addButton'));
    fireEvent.change(screen.getByRole('textbox', { name: 'Name' }), { target: { value: 'Trainee Test' } });
    const input = screen.getAllByRole('textbox', { name: '' });
    fireEvent.change(input[0], { target: { value: 'a@b.c' } });
    fireEvent.change(input[1], { target: { value: 'Qwerty@' } });
    fireEvent.change(input[2], { target: { value: 'Qwerty1' } });
    const element = screen.getByTestId('addSubmit');
    expect(element).toHaveProperty('disabled');
  });
});
