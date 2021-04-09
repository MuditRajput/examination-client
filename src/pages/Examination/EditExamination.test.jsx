import React from 'react';
import {
  render, cleanup, screen,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { EditExamination } from './Components/EditDialog';

beforeEach(() => {
  render(
    <EditExamination open onSubmit={(details) => { console.log(details); }} onClose={() => {}} />,
  );
});
afterEach(cleanup);

describe('Edit Examination', () => {
  test('passed if add examination dialogue is rendered', () => {
    const element = screen.getByTestId('dialogText');
    expect(element).toHaveTextContent('Edit Examination');
  });
  test('passed if submit button is disabled initially', () => {
    const element = screen.getByTestId('editSubmit');
    expect(element).toHaveProperty('disabled', true);
  });
});
