import React from 'react';
import {
  render, cleanup, screen, waitFor,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { ChildrenDemo } from '..';

beforeEach(async () => {
  await waitFor(() => {
    render(
      <ChildrenDemo />,
    );
  });
});
afterEach(cleanup);

describe('Children demo test', () => {
  test('first child is rendered', () => {
    const element = screen.getByTestId('template');
    expect(element).toHaveTextContent('Result of 4 + 5 is 9');
  });
  test('first child is rendered', () => {
    const element = screen.getByTestId('childSecond');
    expect(element).toHaveTextContent('When we divide 1 with 0 then result is Infinity');
  });
  test('first child is rendered', () => {
    const element = screen.getByTestId('childFirst');
    expect(element).toHaveTextContent('Sum of 1 and 0 is 1');
  });
});
