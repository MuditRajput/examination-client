import { gql } from '@apollo/client';

export const TRAINEE_ADDED = gql`
  subscription TraineeAdded{
    traineeAdded{
      status
      data {
        originalId
        name
        email
        createdAt
      }
      message
    }
  }
`;

export const TRAINEE_UPDATED = gql`
  subscription TraineeUpdated{
    traineeUpdated{
      status
      data {
        originalId
        name
        email
        createdAt
      }
      message
    }
  }
`;

export const TRAINEE_DELETED = gql`
  subscription TraineeDeleted{
    traineeDeleted{
      status
      message
    }
  }
`;
