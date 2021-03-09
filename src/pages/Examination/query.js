import { gql } from '@apollo/client';

export const GETALL_EXAMINATION = gql`
  query GetAllExamination{
  getAllExamination{
    status
    message
    data{
      subject
      description
      maximumMarks
      originalId
    }
    write
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
