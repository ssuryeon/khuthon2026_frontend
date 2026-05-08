import {useEffect, useRef, useState} from 'react';
import Header from '../components/Header';
import Menu from '../components/Menu';
import {useTheme} from 'styled-components';
import { MdOutlinePeopleAlt } from "react-icons/md";
import { IoMdMusicalNote } from "react-icons/io";
import { GoHome } from "react-icons/go";
import { Button } from '../components/Button';
import { modeStore } from '../stores/userStore';
import { userStore } from '../stores/userStore';
import {getStation} from '../utils/station';

const displays = [
    {
      "imageUrl": "/1.png",
      "name": "러키더키 석적점",
      "address": "경북 칠곡군 석적읍 석적로 140",
      "status": "영업중",
      "hours": "매일 10:00-22:00",
      "closed": "매주 수요일 휴무",
      "phone": "054-979-3421"
    },
    {
        "imageUrl": "/2.png",
      "name": "진가재 북카페",
      "address": "경북 칠곡군 석적읍 강변대로 1527",
      "status": "영업중",
      "hours": "매일 10:00-21:00",
      "closed": "매주 월요일 휴무",
      "phone": "054-977-5669"
    },
    {
        "imageUrl": "/3.png",
      "name": "석적문화예술회관 소공연장",
      "address": "경북 칠곡군 석적읍 남율로 15",
      "status": "영업중",
      "hours": "매일 09:00-18:00",
      "closed": null,
      "phone": "054-979-8700"
    },
    {
        "imageUrl": "/4.png",
      "name": "아트갤러리 석적",
      "address": "경북 칠곡군 석적읍 중리 140-2",
      "status": "영업중",
      "hours": "매일 10:00-17:00",
      "closed": null,
      "phone": "054-978-3222"
    }
]

const music_concert = [
    {
        "imageUrl": "/5.png",
      "name": "석적 지역아동센터 다목적홀",
      "address": "경북 칠곡군 석적읍 서중리 12-4",
      "status": "영업중",
      "hours": "매일 09:00-17:00",
      "phone": "054-975-1231"
    },
    {
        "imageUrl": "/6.png",
      "name": "투썸플레이스 칠곡석적유학로점",
      "address": "경북 칠곡군 석적읍 유학로 61",
      "status": "영업중",
      "hours": "매일 09:00-23:00",
      "phone": "054-977-5669"
    },
    {
        "imageUrl": "/7.png",
      "name": "카페 온유",
      "address": "경북 칠곡군 석적읍 남율로 9길 32",
      "status": "영업중",
      "hours": "매일 09:00-21:00",
      "phone": "054-971-2240"
    },
    {
        "imageUrl": "/8.png",
      "name": "석적문화회관 야외광장",
      "address": "경북 칠곡군 석적읍 남율로 112",
      "status": "영업중",
      "hours": "매일 09:00-23:00",
      "phone": "054-979-8800"
    }
  ]

  const viewing_concert = [
    {
        "imageUrl": "/9.png",
      "name": "갤러리 스페이스 석적",
      "address": "경북 칠곡군 석적읍 북중리 214-3",
      "status": "영업중",
      "hours": "매일 10:00-17:00",
      "phone": "054-978-7721"
    },
    {
        "imageUrl": "/10.png",
      "name": "브루잉하우스 카페",
      "address": "경북 칠곡군 석적읍 강변대로 221",
      "status": "영업중",
      "closed": "매주 월요일 휴무",
      "phone": "054-972-5561"
    },
    {
        "imageUrl": "/11.png",
      "name": "라운지 북카페 오늘",
      "address": "경북 칠곡군 석적읍 중앙로 55",
      "status": "영업중",
      "hours": "매일 10:00-23:00",
      "phone": "054-973-1112"
    },
    {
        "imageUrl": "/12.png",
      "name": "스테이지 루프 카페",
      "address": "경북 칠곡군 석적읍 북중리 91-4",
      "status": "영업중",
      "hours": "매일 10:00-22:00",
      "phone": "054-976-4428"
    }
  ]

interface IList {
    imageUrl: string,
    name: string,
    address: string,
    info?: string,
    hours?: string,
    closed?: string | null,
    phone: string,
    status?: string,
}

function List({imageUrl, name, address, info, phone, onClick}:{onClick?: () => void} & IList) {
    return (
        <div
          onClick={onClick}
          style={{
            backgroundColor: '#EDEDED',
            width: '100%',
            maxWidth: 360,
            height: 169,
            display: 'flex',
            borderRadius: 20,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
            gap: 12,
            padding: 16,
            boxSizing: 'border-box',
            cursor: onClick ? 'pointer' : 'default'
          }}
        >
            <div style={{width: 135, minWidth: 135, height: 135, flexShrink: 0, borderRadius: 10, background: `url(${imageUrl}) center top/cover no-repeat`}}></div>
            <div style={{flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                <span style={{fontSize: 15, fontWeight: 600, marginBottom: 20}}>{name}</span>
                <span style={{fontSize: 12, fontWeight: 500, color: '#656565'}}>{address}</span>
                <span style={{fontSize: 12, fontWeight: 500, color: '#656565'}}>{info}</span>
                <span style={{fontSize: 12, fontWeight: 500, color: '#656565'}}>{phone}</span>
            </div>
        </div>
    )
}



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

function ViewerMode({ map }: { map: any }) {
    const [category, setCategory] = useState('');
    const [selectedPlace, setSelectedPlace] = useState<IList | null>(null);
    const markersRef = useRef<any[]>([]);
    const overlaysRef = useRef<Record<string, any>>({});
    const [demandByPlaceId, setDemandByPlaceId] = useState<Record<string, number>>({});
    const appliedRef = useRef<Set<string>>(new Set());
    const userId = userStore((state) => state.user_id);

    const placeIdOf = (p: IList) => p.address;

    const overlayHtml = (count: number) => `
      <div style="
        min-width: 32px;
        height: 22px;
        padding: 0 8px;
        border-radius: 999px;
        background: rgba(108, 92, 231, 0.95);
        color: white;
        font-size: 12px;
        font-weight: 900;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 6px 14px rgba(0,0,0,0.18);
        border: 1px solid rgba(255,255,255,0.55);
      ">${count}</div>
    `;

    const onClick = (new_c: string) => {
        setCategory(new_c);
        setSelectedPlace(null);

        // 🔥 안전 체크
        if (!map) return;
        if (!window.kakao?.maps?.services) {
            console.warn('[kakao] services library not loaded. Add "&libraries=services" to the sdk.js script URL.');
            return;
        }

        const geocoder = new window.kakao.maps.services.Geocoder();

        // 🔥 기존 마커 제거
        markersRef.current.forEach((m) => m.setMap(null));
        markersRef.current = [];
        Object.values(overlaysRef.current).forEach((ov: any) => ov.setMap(null));
        overlaysRef.current = {};

        const addMarkersAndFitBounds = (items: IList[]) => {
            if (items.length === 0) return;

            const bounds = new window.kakao.maps.LatLngBounds();
            let pending = items.length;
            let okCount = 0;

            items.forEach((item) => {
                geocoder.addressSearch(item.address, (res: any, status: any) => {
                    if (status === window.kakao.maps.services.Status.OK) {
                        const coords = new window.kakao.maps.LatLng(res[0].y, res[0].x);
                        const marker = new window.kakao.maps.Marker({
                            map,
                            position: coords,
                        });
                        markersRef.current.push(marker);
                        bounds.extend(coords);
                        okCount += 1;

                        const placeId = placeIdOf(item);
                        const count = demandByPlaceId[placeId] ?? 0;
                        const overlay = new window.kakao.maps.CustomOverlay({
                            position: coords,
                            content: overlayHtml(count),
                            yAnchor: 1.8,
                            zIndex: 10,
                        });
                        overlay.setMap(map);
                        overlaysRef.current[placeId] = overlay;
                    }

                    pending -= 1;
                    if (pending === 0 && okCount > 0) {
                        map.setBounds(bounds);
                    }
                });
            });
        };

        switch (new_c) {
            case "display":
                addMarkersAndFitBounds(displays);
                break;
            case "music_concert":
                addMarkersAndFitBounds(music_concert);
                break;
            case "viewing_concert":
                addMarkersAndFitBounds(viewing_concert);
                break;
            default:
                break;
        }
    };

    return (
        <div style={{ width: '100%', height: '100%', position: 'relative', pointerEvents: 'none' }}>
            
            {/* 버튼 영역 */}
            <div style={{
                position: 'absolute',
                top: 20,
                width: '100%',
                display: 'flex',
                padding: '0 16px',
                boxSizing: 'border-box',
                gap: 10,
                justifyContent: 'space-between',
                zIndex: 3,
                pointerEvents: 'auto'
            }}>
                <div onClick={() => onClick('display')}
                    style={{
                        flex: 1,
                        height: 34,
                        borderRadius: 15,
                        border: '1px solid rgba(0, 0, 0, 0.25)',
                        textAlign: 'center',
                        background: category === 'display' ? '#A78BFA' : '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: 13,
                        boxSizing: 'border-box'
                    }}>
                    전시
                </div>

                <div onClick={() => onClick('music_concert')}
                    style={{
                        flex: 1,
                        height: 34,
                        borderRadius: 15,
                        border: '1px solid rgba(0, 0, 0, 0.25)',
                        textAlign: 'center',
                        background: category === 'music_concert' ? '#A78BFA' : '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: 13,
                        boxSizing: 'border-box'
                    }}>
                    음악 공연
                </div>

                <div onClick={() => onClick('viewing_concert')}
                    style={{
                        flex: 1,
                        height: 34,
                        borderRadius: 15,
                        border: '1px solid rgba(0, 0, 0, 0.25)',
                        textAlign: 'center',
                        background: category === 'viewing_concert' ? '#A78BFA' : '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: 13,
                        boxSizing: 'border-box'
                    }}>
                    관람 공연
                </div>
            </div>

            {/* 리스트 영역 */}
            <div style={{
                padding: 15,
                position: 'absolute',
                bottom: -28,
                width: '100%',
                maxHeight: 215,
                overflowY: 'auto',
                background: '#fff',
                borderRadius: '20px 20px 0 0',
                zIndex: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: selectedPlace ? 'stretch' : 'center',
                boxSizing: 'border-box',
                gap: 12,
                pointerEvents: 'auto'
            }}>
                {selectedPlace ? (
                  <div style={{width: '100%', display: 'flex', flexDirection: 'column', gap: 12}}>
                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                      <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
                        <button
                          type="button"
                          onClick={() => setSelectedPlace(null)}
                          style={{width: 36, height: 36, border: 'none', background: 'transparent', fontSize: 20, cursor: 'pointer'}}
                          aria-label="back"
                        >
                          ‹
                        </button>
                        <span style={{fontSize: 16, fontWeight: 800}}>장소 정보</span>
                      </div>
                      <button
                        type="button"
                        style={{width: 36, height: 36, border: 'none', background: 'transparent', fontSize: 18, cursor: 'pointer'}}
                        aria-label="favorite"
                      >
                        ♡
                      </button>
                    </div>

                    <div style={{width: '100%', height: 180, borderRadius: 16, background: `url(${selectedPlace.imageUrl}) center center/cover no-repeat`, position: 'relative', overflow: 'hidden'}}>
                      <div style={{position: 'absolute', right: 10, bottom: 10, padding: '4px 8px', borderRadius: 999, fontSize: 12, fontWeight: 700, background: 'rgba(0,0,0,0.45)', color: '#fff'}}>
                        1/6
                      </div>
                    </div>

                    <div style={{padding: '6px 4px 0', display: 'flex', flexDirection: 'column', gap: 8}}>
                      <div style={{fontSize: 16, fontWeight: 900}}>{selectedPlace.name}</div>
                      <div style={{display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'rgba(31,36,48,0.6)', fontWeight: 700}}>
                        <span style={{color: '#F5B301'}}>★</span>
                        <span>4.6 (128)</span>
                      </div>

                      <div style={{display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12, color: 'rgba(31,36,48,0.65)', fontWeight: 700}}>
                        <div>📍 {selectedPlace.address}</div>
                        {selectedPlace.hours ? <div>⏰ {selectedPlace.hours}{selectedPlace.status ? ` (${selectedPlace.status})` : ''}</div> : null}
                        {selectedPlace.closed ? <div>🚫 {selectedPlace.closed}</div> : null}
                        <div>☎ {selectedPlace.phone}</div>
                      </div>

                      <div style={{marginTop: 6, background: 'rgba(108, 92, 231, 0.08)', border: '1px solid rgba(108, 92, 231, 0.16)', borderRadius: 14, padding: 12, fontSize: 12, fontWeight: 700, color: 'rgba(31,36,48,0.7)'}}>
                        안내사항
                        <div style={{marginTop: 8, fontSize: 11, fontWeight: 600, color: 'rgba(31,36,48,0.55)', lineHeight: 1.35}}>
                          - 공연 관람 이용 수칙을 꼭 확인해요.<br />
                          - 상황에 따라 일정과 콘텐츠가 변동됩니다.<br />
                          - 관람 및 안전 수칙을 꼭 부탁드려요.
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        if (!selectedPlace) return;
                        if (userId == null) {
                          window.alert('로그인 후 수요 신청이 가능합니다.');
                          return;
                        }

                        const placeId = placeIdOf(selectedPlace);
                        const key = `${userId}:${placeId}`;
                        if (appliedRef.current.has(key)) {
                          window.alert('이미 수요 신청한 장소입니다.');
                          return;
                        }
                        appliedRef.current.add(key);

                        setDemandByPlaceId((prev) => {
                          const next = { ...prev, [placeId]: (prev[placeId] ?? 0) + 1 };
                          const overlay = overlaysRef.current[placeId];
                          if (overlay) overlay.setContent(overlayHtml(next[placeId]));
                          return next;
                        });
                      }}
                      style={{
                        height: 52,
                        borderRadius: 16,
                        border: 'none',
                        background: '#6C5CE7',
                        color: '#fff',
                        fontSize: 15,
                        fontWeight: 900,
                        cursor: 'pointer',
                        marginTop: 4
                      }}
                    >
                      수요 신청하기
                    </button>
                  </div>
                ) : (
                  (category === "display"
                    ? displays.map((d, i) => (
                        <List key={i} {...d} onClick={() => setSelectedPlace(d)} />
                    ))
                    : category === "music_concert"
                        ? music_concert.map((d, i) => (
                            <List key={i} {...d} onClick={() => setSelectedPlace(d)} />
                        ))
                        : category === "viewing_concert"
                            ? viewing_concert.map((d, i) => (
                                <List key={i} {...d} onClick={() => setSelectedPlace(d)} />
                            ))
                            : null)
                )}
            </div>
        </div>
    );
}

function Main() {
    const mapRef = useRef(null);
    const selected = modeStore((state) => state.selected);
    const mode = modeStore((state) => state.mode);
    const [map, setMap] = useState<any>(null);

    useEffect(() => {
        const container = mapRef.current;
        const options = {
            center: new window.kakao.maps.LatLng(33.450701, 126.570667),
            level: 3,
         };
        const created = new window.kakao.maps.Map(container, options);
        setMap(created);

    }, [])

    useEffect(() => {
        console.log(selected)
        console.log(mode)
    }, [selected, mode])

    return (
        <div style={{display: 'flex', flexDirection: 'column', width: '100%', height: '100vh', minHeight: 0}}>
            <Header text="문화 정류장"/>
            <div style={{width: '100%', flex: 1, overflow: 'hidden', minHeight: 0, position: 'relative'}}>
                <div ref={mapRef} style={{width: '100%', height: '100%'}} id='map'/>
                {selected
                  ? (
                    <div style={{position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none'}}>
                      <ViewerMode map={map} />
                    </div>
                  )
                  : <Modal />
                }
            </div>
            <Menu />
        </div>
    )
}

export default Main;