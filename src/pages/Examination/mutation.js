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
