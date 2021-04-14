import React from 'react';
import {
  render, cleanup, screen, waitFor,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { ApolloProvider } from '@apollo/client';
import { SnackBarProvider } from '../../contexts';
import apolloClient from '../../lib/apollo-client';
import Results from './Result';

beforeEach(async () => {
  await waitFor(() => {
    render(
      <ApolloProvider client={apolloClient}>
        <SnackBarProvider>
          <Results history={{ push: '' }} />
        </SnackBarProvider>
      </ApolloProvider>,
    );
  });
});
afterEach(cleanup);

describe('Render Results', () => {
  test('recent exams title render', () => {
    const element = screen.getByTestId('recentTitle');
    expect(element).toHaveTextContent('Recent Exams');
  });
  test('head render of results list', () => {
    const element = screen.getAllByTestId('tableHead');
    expect(element).toHaveLength(1);
  });
});
