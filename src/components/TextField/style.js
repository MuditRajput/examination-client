import styled from 'styled-components';

export const Input = styled.input`
  display: block;
  padding: 10px;
  width: 100%;
  box-sizing: border-box;
  border: ${(props) => (props.error ? '1px solid red' : '1px soled grey')};
`;

export const P = styled.p`
  color: red;
  font-size:12px;
`;
