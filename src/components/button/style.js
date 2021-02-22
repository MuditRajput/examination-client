import styled from 'styled-components';

export const Button = styled.button`
    padding: 8px 20px;
    margin: 20px 4px;
    position: relative;
    border: 1px solid #bdbdbd;
    left: 80%;
    border-radius: 4px;
    background:  ${(props) => (props.colored ? '#36bf36' : 'inherit')};
    color:  ${(props) => (props.colored ? 'white' : 'inherit')};
`;
