import { gql } from '@apollo/client';

const CREATE_TRAINEE = gql`
  mutation CreateTrainee($email: String!, $name: String!, $password: String!) {
    createTrainee(user: { email: $email, name: $name, password: $password }) {
      message
      status
    }
  }
`;

const UPDATE_TRAINEE = gql`
  mutation UpdateTrainee($id: ID!, $name: String!, $email: String!) {
    updateTrainee(id: $id, dataToUpdate: { name: $name, email: $email }) {
      message
      status
    }
  }
`;

const DELETE_TRAINEE = gql`
  mutation DeleteTrainee($id: ID!) {
    deleteTrainee(id: $id) {
      message
      status
    }
  }
`;

export {
  CREATE_TRAINEE,
};
export {
  UPDATE_TRAINEE,
};
export {
  DELETE_TRAINEE,
};
