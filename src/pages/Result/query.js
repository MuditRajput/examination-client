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
        questionSet
        userId
      }
      message
      status
    }
  }
`;

export const GETALL_QUESTIONS = gql`
  query GetAllQuestions($id: ID!) {
  getAllQuestions(id:$id){
    data{
      question
      options
      correctOption
      originalId
    }
    status
    message
  }
}
`;
