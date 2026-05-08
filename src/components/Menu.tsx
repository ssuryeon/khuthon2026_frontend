import styled from 'styled-components';
import { FaRegBell } from "react-icons/fa";
import { LuMapPinned } from "react-icons/lu";
import { FaClockRotateLeft } from "react-icons/fa6";
import { BsPerson } from "react-icons/bs";
import { useNavigate } from 'react-router';

const Container = styled.div`
    width: 100%;
    height: 90px;
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    background-color: ${props => props.theme.white};
`;

function Menu() {
    const navigate = useNavigate();

    return (
        <Container>
            <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '20%', cursor: 'pointer'}}>
                <LuMapPinned size={27}/>
                <span style={{fontWeight: 500, fontSize: 12, marginTop: 2}}>지도</span>
            </div>
            <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '20%', cursor: 'pointer'}} onClick={() => navigate('/activity')}>
                <FaClockRotateLeft size={27} />
                <span style={{fontWeight: 500, fontSize: 12, marginTop: 2}}>내 활동</span>
            </div>
            <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '20%', cursor: 'pointer'}}>
                <FaRegBell size={27}/>
                <span style={{fontWeight: 500, fontSize: 12, marginTop: 2}}>알림</span>
            </div>
            <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '20%', cursor: 'pointer'}}>
                <BsPerson size={27}/>
                <span style={{fontWeight: 500, fontSize: 12, marginTop: 2}}>마이페이지</span>
            </div>
        </Container>
    )
}

export default Menu;