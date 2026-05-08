import {useEffect, useRef} from 'react';
import Header from '../components/Header';
import Menu from '../components/Menu';

function Home() {
    const mapRef = useRef(null);

    useEffect(() => {
        const container = mapRef.current;
        const options = {
            center: new window.kakao.maps.LatLng(33.450701, 126.570667),
            level: 3,
         };
        new window.kakao.maps.Map(container, options);

    }, [])

    return (
        <div style={{display: 'flex', flexDirection: 'column', width: '100%', height: '100vh', minHeight: 0}}>
            <Header text="문화 정류장"/>
            <div style={{width: '100%', flex: 1, overflow: 'hidden', minHeight: 0}}>
                <div ref={mapRef} style={{width: '100%', height: '100%'}} />
            </div>
            <Menu />
        </div>
    )
}

export default Home;