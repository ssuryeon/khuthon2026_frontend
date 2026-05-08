import styled from 'styled-components';
import { FiMenu } from "react-icons/fi";
import { FaRegBell } from "react-icons/fa";
import { useNavigate } from 'react-router';

interface IHeader {
    text:string
}

const Container = styled.div`
    width: 100%; 
    height: 80px; 
    background-color: ${props => props.theme.white};
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
    box-sizing: border-box;
    padding: 8;
`;

function Header({text}:IHeader) {
    const navigate = useNavigate();

    return (
        <Container>
            <FiMenu size={20}/>
            <span style={{fontSize: 20, fontWeight: 500}}>{text}</span>
            <FaRegBell size={20} onClick={() => navigate('/alarm')}/>
        </Container>
    )
}

export default Header;