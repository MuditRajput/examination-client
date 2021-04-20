import React from 'react';
import {
  render, cleanup, waitFor, screen,
} from '@testing-library/react';
import { ApolloProvider } from '@apollo/client';
import '@testing-library/jest-dom/extend-expect';
import { SnackBarProvider } from '../../contexts';
import apolloClient from '../../lib/apollo-client';
import Examinations from './Examination';

beforeEach(async () => {
  await waitFor(() => {
    render(
      <ApolloProvider client={apolloClient}>
        <SnackBarProvider>
          <Examinations match={{ path: 'trainee' }} history={{ push: '' }} />
        </SnackBarProvider>
      </ApolloProvider>,
    );
  });
});
afterEach(cleanup);

describe('Exam', () => {
  test('Examinations add button is rendered', () => {
    const element = screen.getAllByTestId('addButton');
    expect(element.length).toBe(1);
  });
  test('progress is rendered', () => {
    const element = screen.getAllByRole('progressbar');
    expect(element.length).toBe(1);
  });
});
