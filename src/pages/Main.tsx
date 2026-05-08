import {useEffect, useRef, useState} from 'react';
import Header from '../components/Header';
import Menu from '../components/Menu';
import {useTheme} from 'styled-components';
import { MdOutlinePeopleAlt } from "react-icons/md";
import { IoMdMusicalNote } from "react-icons/io";
import { GoHome } from "react-icons/go";
import { Button } from '../components/Button';
import { modeStore } from '../stores/userStore';


function Modal() {
    const theme = useTheme();
    const setMode = modeStore((state) => state.setMode);
    const setSelected = modeStore((state) => state.setSelected);

    return (
        <div style={{width: '100%', borderRadius: 20, position: 'absolute', bottom: -15, backgroundColor: theme.white, zIndex: 2, display: 'flex', flexDirection: 'column', padding: '15px 15px', boxSizing: 'border-box', boxShadow: '0 -10px 10px rgba(0, 0, 0, 0.1)'}}>
                <span style={{fontSize: 18, fontWeight: 600, marginBottom: 4}}>문화 정류장이란?</span>
                <span style={{fontSize: 14, fontWeight: 500, color: '#656565', marginBottom: 10}}>내가 있는 곳으로 문화가 찾아오는 서비스</span>
                <div style={{width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10}}>
                    <div style={{backgroundColor: '#EDEDED', padding: '13px 15px', borderRadius: 10, display: 'flex', flexDirection: 'column', width: '30%', justifyContent: 'center', alignItems: 'center', boxSizing: 'border-box', cursor: 'pointer'}} onClick={() => {setMode('viewer'); setSelected()}}>
                        <MdOutlinePeopleAlt size={45}/>
                        <span style={{fontSize: 14, fontWeight: 600}}>관객 모드</span>
                    </div>
                    <div style={{backgroundColor: '#EDEDED', padding: '13px 15px', borderRadius: 10, display: 'flex', flexDirection: 'column', width: '30%', justifyContent: 'center', alignItems: 'center', boxSizing: 'border-box', cursor: 'pointer'}} onClick={() => {setMode('artist'); setSelected()}}>
                        <IoMdMusicalNote size={45}/>
                        <span style={{fontSize: 14, fontWeight: 600}}>아티스트 모드</span>
                    </div>
                    <div style={{backgroundColor: '#EDEDED', padding: '13px 15px', borderRadius: 10, display: 'flex', flexDirection: 'column', width: '30%', justifyContent: 'center', alignItems: 'center', boxSizing: 'border-box', cursor: 'pointer'}} onClick={() => {setMode('renter'); setSelected()}}>
                        <GoHome size={45}/>
                        <span style={{fontSize: 14, fontWeight: 600}}>공간 대여자</span>
                    </div>
                </div>
                <Button>참여하기</Button>
        </div>
    )
}

function ViewerMode() {
    return (
        <div style={{width: '100%', height: '100%', zIndex: 2, position: 'relative'}}>
            <div style={{position: 'absolute', top: 20}}>
                <div style={{width: 100, height: 34, borderRadius: 15, border: '1px solid rgba(0, 0, 0, 0.25)'}}>전시</div>
                <div style={{width: 100, height: 34, borderRadius: 15, border: '1px solid rgba(0, 0, 0, 0.25)'}}>음악 공연</div>
                <div style={{width: 100, height: 34, borderRadius: 15, border: '1px solid rgba(0, 0, 0, 0.25)'}}>관람 공연</div>
            </div>
            <div style={{padding: 15, width: '100%', minHeight: 230, position: 'absolute', bottom: 230, backgroundColor: '#fff'}}>
                <div style={{backgroundColor: '#EDEDED', width: '100%', height: 169}}>
                    <span style={{fontSize: 15, fontWeight: 600}}>투썸플레이스 칠곡석적유학로점</span>
                    <span style={{fontSize: 12, fontWeight: 500, color: '#656565'}}>경북 칠곡군 석적읍 유학로 61</span>
                    <span style={{fontSize: 12, fontWeight: 500, color: '#656565'}}>영업중ㅣ매일 09:00-23:00</span>
                    <span style={{fontSize: 12, fontWeight: 500, color: '#656565'}}>054-977-5669</span>
                </div>
            </div>
        </div>
    )
}

function Main() {
    const mapRef = useRef(null);
    const selected = modeStore((state) => state.selected);
    const mode = modeStore((state) => state.mode);

    useEffect(() => {
        const container = mapRef.current;
        const options = {
            center: new window.kakao.maps.LatLng(33.450701, 126.570667),
            level: 3,
         };
        new window.kakao.maps.Map(container, options);

    }, [])

    useEffect(() => {
        console.log(selected)
        console.log(mode)
    }, [selected, mode])

    return (
        <div style={{display: 'flex', flexDirection: 'column', width: '100%', height: '100vh', minHeight: 0}}>
            <Header text="문화 정류장"/>
            <div style={{width: '100%', flex: 1, overflow: 'hidden', minHeight: 0, position: 'relative'}}>
                <div ref={mapRef} style={{width: '100%', height: '100%'}} />
                {selected? <div style={{width: '100%', height: '100%', zIndex: 2}}><ViewerMode /></div> :<Modal />}
            </div>
            <Menu />
        </div>
    )
}

export default Main;