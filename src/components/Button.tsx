import styled from 'styled-components';

export const Button = styled.button`
    width: '100%';
    color: white;
    font-size: 16px;
    font-weight: 600;
    background-color: ${props => props.theme.btnColor};
    border: none;
    border-radius: 30px;
    padding: 10px;
    cursor: pointer;
`;