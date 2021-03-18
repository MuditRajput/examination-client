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
      time
      maxAttempts
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
      optionType
      originalId
    }
    numberOfAttempts
    status
    message
  }
}
`;
