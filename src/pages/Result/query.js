import { gql } from '@apollo/client';

export const GETALL_RESULTS = gql`
  query GetAllResult{
    getAllResult{
      data {
        originalId
        createdAt
        result
        userId
        questionSet
      }
      message
      status
    }
  }
`;

export const GETONE_RESULT = gql`
  query GetOneResult($id: ID!) {
    getOneResult(id: $id){
      data {
        originalId
        createdAt
        result
        userId
      }
      message
      status
    }
  }
`;
