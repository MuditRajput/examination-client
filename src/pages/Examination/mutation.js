import { gql } from '@apollo/client';

export const CREATE_EXAMINATION = gql`
  mutation CreateTrainee($subject: String!, $description: String, $maximumMarks: String) {
  createExamination(subject: $subject, description: $description, maximumMarks: $maximumMarks){
    status
    message
    data{
      subject
      description
      maximumMarks
      originalId
    }
  }
}
`;

export const UPDATE_EXAMINATION = gql`
  mutation UpdateExamination($originalId: ID!, $subject: String!, $description: String, $maximumMarks: String) {
  updateExamination(payload: {originalId: $originalId, dataToUpdate: {subject: $subject, description: $description, maximumMarks: $maximumMarks } }) {
    data {
      subject
      originalId
    }
    status
    message
  }
}
`;

export const DELETE_EXAMINATION = gql`
  mutation DeleteExamination($id: ID!) {
  deleteExamination(id: $id){
    status
    message
  }
}
`;

export const ADD_QUESTIONS = gql`
  mutation CreateQuestions($originalId: String!, $questionList: [questionInput]!) {
    createQuestions(payload:{originalId: $originalId, questionList: $questionList}){
      data {
        originalId
        question
        options
      }
      status
      message
    }
  }
`;

export const UPDATE_QUESTIONS = gql`
  mutation UpdateQuestions($originalId: ID!, $questionInput: questionInput!) {
  updateQuestions(originalId: $originalId, dataToUpdate: $questionInput){
    status
    data{
      question
      originalId
    }
    message
  }
}
`;

export const DELETE_QUESTIONS = gql`
  mutation DeleteQuestions($originalId: ID!) {
  deleteQuestions(id: $originalId) {
    status
    message
  }
}
`;

export const SUBMIT_QUESTIONS = gql`
  mutation SubmitQuestions($answersList: JSON!, $questionSet: ID!) {
    submitQuestions(answersList: $answersList, questionSet: $questionSet) {
      result
      questionSet
      originalId
    }
  }
`;