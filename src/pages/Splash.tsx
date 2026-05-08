import { useEffect } from 'react';
import backgroundURL from '/Splash_background.svg';
import { useNavigate } from 'react-router';

function Splash() {
    const navigate = useNavigate();

    useEffect(() => {
        setTimeout(() => {
            navigate('/login')
        }, 3000);
    }, []);

    return (
        <div style={{width: '100%', height: '100%', background: `url(${backgroundURL}) center top/cover no-repeat`}}></div>
    )
}

export default Splash;