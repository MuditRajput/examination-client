import React from 'react';
import {
  render, cleanup, screen,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { TableComponent } from './components';
import trainees from './pages/Trainee/data/Trainee';

beforeEach(() => {
  render(
    <TableComponent
      data={trainees}
      id="id"
      columns={[
        {
          field: 'name',
          label: 'Name',
        },
        {
          field: 'email',
          label: 'Email Address',
          format: (value) => value && value.toUpperCase(),
        },
        {
          field: 'createdAt',
          label: 'Date',
          align: 'right',
        },
      ]}
      onSelect={() => {}}
      onSort={() => {}}
      onChangePage={() => {}}
    />,
  );
});
afterEach(cleanup);

describe('FIRST', () => {
  test('count rows', () => {
    const element = screen.getAllByTestId('row');
    expect(element).toHaveLength(5);
  });
});
describe('SECOND', () => {
  test('should have 1 table container', () => {
    const element = screen.getAllByTestId('container');
    expect(element).toHaveLength(1);
  });
});
