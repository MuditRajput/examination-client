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
  query GetAllQuestions($id: ID!, $timeLimit: Int, $submitted: String) {
  getAllQuestions(id:$id, timeLimit: $timeLimit, submitted: $submitted){
    data{
      question
      options
      correctOption
      optionType
      originalId
    }
    timeLeft
    numberOfAttempts
    status
    message
  }
}
`;
