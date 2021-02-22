import { gql } from '@apollo/client';

const GETALL_TRAINEES = gql`
  query GetAllTrainees($skip: Int, $limit: Int, $sortBy: String, $sortOrder: String ) {
    getAllTrainees(options: { skip: $skip, limit: $limit, sortBy: $sortBy, sortOrder: $sortOrder }) {
      message
      status
      data {
        totalCount
        UsersList {
          originalId
          name
          email
          role
          createdAt
        }
      }
    }
  }
`;

export const GET_ONE = gql`
  query GetOneTrainee($id: ID!) {
    getOneTrainee(id: $id) {
      data {
        name
        originalId
        email
        createdAt
      }
    }
  }
`;

export {
  GETALL_TRAINEES,
};
