import React from 'react';
import {
  render, cleanup, waitFor, screen,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Timer from './Timer';

beforeEach(async () => {
  await waitFor(() => {
    render(
      <Timer seconds={0} onComplete={() => {}} />,
    );
  });
});
afterEach(cleanup);

describe('Exam', () => {
  test('timer is rendered and completed', () => {
    const element = screen.getAllByText('0:0:0');
    expect(element).toHaveLength(1);
  });
});
