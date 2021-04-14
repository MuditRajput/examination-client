import React from 'react';
import {
  render, cleanup, screen, waitFor,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { ApolloProvider } from '@apollo/client';
import { SnackBarProvider } from '../../contexts';
import apolloClient from '../../lib/apollo-client';
import ResultDetail from './ResultDetail';

beforeEach(async () => {
  await waitFor(() => {
    render(
      <ApolloProvider client={apolloClient}>
        <SnackBarProvider>
          <ResultDetail match={{}} />
        </SnackBarProvider>
      </ApolloProvider>,
    );
  });
});
afterEach(cleanup);

describe('Render Results', () => {
  test('head render of results list', () => {
    const element = screen.getAllByTestId('progress');
    expect(element).toHaveLength(1);
  });
});
