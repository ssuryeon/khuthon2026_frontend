import { useEffect, useRef, useState } from 'react';
import Header from '../components/Header';
import Menu from '../components/Menu';
import { useTheme } from 'styled-components';
import { MdOutlinePeopleAlt } from "react-icons/md";
import { IoMdMusicalNote } from "react-icons/io";
import { GoHome } from "react-icons/go";
import { Button } from '../components/Button';
import { modeStore } from '../stores/userStore';
import { userStore } from '../stores/userStore';
import { getStation } from '../utils/station';
import { useNavigate } from 'react-router';

type StationApi = {
    id: number;
    latitude: number;
    longitude: number;
    address: string;
    capacity: number;
    supported_genres: string;
    hourly_cost: number;
    is_active: boolean;
    current_count?: number;
}

interface IList {
    id: number,
    latitude: number,
    longitude: number,
    imageUrl: string,
    name: string,
    address: string,
    info?: string,
    hours?: string,
    closed?: string | null,
    phone?: string,
    status?: string,
    supported_genres: string,
    capacity: number,
    hourly_cost: number,
    is_active: boolean,
    current_count?: number,
}

const matchesCategory = (genre: string, category: string) => {
    const g = (genre || '').toLowerCase();
    if (category === 'display') {
        return g.includes('display') || g.includes('exhibit') || g.includes('전시');
    }
    if (category === 'music_concert') {
        return g.includes('music') || g.includes('busking') || g.includes('음악');
    }
    if (category === 'viewing_concert') {
        return g.includes('viewing') || g.includes('performance') || g.includes('concert') || g.includes('관람') || g.includes('공연');
    }
    return true;
}

const getMarkerColor = (count: number) => {
    if (count <= 10) return '#4285F4'; // Blue
    if (count < 30) return '#FBBC05'; // Yellow
    return '#EA4335'; // Red
}

function List({ imageUrl, name, address, info, phone, onClick }: { onClick?: () => void } & IList) {
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
            <div style={{ width: 135, minWidth: 135, height: 135, flexShrink: 0, borderRadius: 10, background: `url(${imageUrl}) center top/cover no-repeat` }}></div>
            <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <span style={{ fontSize: 15, fontWeight: 600, marginBottom: 20 }}>{name}</span>
                <span style={{ fontSize: 12, fontWeight: 500, color: '#656565' }}>{address}</span>
                <span style={{ fontSize: 12, fontWeight: 500, color: '#656565' }}>{info}</span>
                {phone ? <span style={{ fontSize: 12, fontWeight: 500, color: '#656565' }}>{phone}</span> : null}
            </div>
        </div>
    )
}



function Modal() {
    const theme = useTheme();
    const setMode = modeStore((state) => state.setMode);
    const setSelected = modeStore((state) => state.setSelected);

    return (
        <div style={{ width: '100%', borderRadius: 20, position: 'absolute', bottom: -15, backgroundColor: theme.white, zIndex: 2, display: 'flex', flexDirection: 'column', padding: '15px 15px', boxSizing: 'border-box', boxShadow: '0 -10px 10px rgba(0, 0, 0, 0.1)' }}>
            <span style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>문화 정류장이란?</span>
            <span style={{ fontSize: 14, fontWeight: 500, color: '#656565', marginBottom: 10 }}>내가 있는 곳으로 문화가 찾아오는 서비스</span>
            <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                <div style={{ backgroundColor: '#EDEDED', padding: '13px 15px', borderRadius: 10, display: 'flex', flexDirection: 'column', width: '30%', justifyContent: 'center', alignItems: 'center', boxSizing: 'border-box', cursor: 'pointer' }} onClick={() => { setMode('viewer'); setSelected() }}>
                    <MdOutlinePeopleAlt size={45} />
                    <span style={{ fontSize: 14, fontWeight: 600 }}>관객 모드</span>
                </div>
                <div style={{ backgroundColor: '#EDEDED', padding: '13px 15px', borderRadius: 10, display: 'flex', flexDirection: 'column', width: '30%', justifyContent: 'center', alignItems: 'center', boxSizing: 'border-box', cursor: 'pointer' }} onClick={() => { setMode('artist'); setSelected() }}>
                    <IoMdMusicalNote size={45} />
                    <span style={{ fontSize: 14, fontWeight: 600 }}>아티스트 모드</span>
                </div>
                <div style={{ backgroundColor: '#EDEDED', padding: '13px 15px', borderRadius: 10, display: 'flex', flexDirection: 'column', width: '30%', justifyContent: 'center', alignItems: 'center', boxSizing: 'border-box', cursor: 'pointer' }} onClick={() => { }}>
                    <GoHome size={45} />
                    <span style={{ fontSize: 14, fontWeight: 600 }}>공간 대여자</span>
                </div>
            </div>
            <Button>참여하기</Button>
        </div>
    )
}

function ViewerMode({ map, stations }: { map: any, stations: IList[] }) {
    const navigate = useNavigate();
    const [category, setCategory] = useState('display');
    const [selectedPlace, setSelectedPlace] = useState<IList | null>(() => {
        try {
            const cached = sessionStorage.getItem('initial-selected-place');
            if (cached) {
                sessionStorage.removeItem('initial-selected-place');
                return JSON.parse(cached);
            }
        } catch (e) {
            // ignore
        }
        return null;
    });
    const [filteredItems, setFilteredItems] = useState<IList[]>([]);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const markersRef = useRef<any[]>([]);
    const overlaysRef = useRef<Record<string, any>>({});
    const [demandByPlaceId, setDemandByPlaceId] = useState<Record<string, number>>({});
    const appliedRef = useRef<Set<string>>(new Set());
    const userId = userStore((state) => state.user_id);
    const mode = modeStore((state) => state.mode);

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

    useEffect(() => {
        let isCancelled = false;
        
        const fetchCategoryData = async () => {
            let genreStr = '';
            if (category === 'display') genreStr = '전시';
            else if (category === 'music_concert') genreStr = '음악';
            else if (category === 'viewing_concert') genreStr = '관람';

            try {
                const res = await getStation(genreStr);
                const rows: StationApi[] = Array.isArray(res) ? res : (Array.isArray(res?.data) ? res.data : []);
                
                const normalized = rows.map((s) => ({
                    id: s.id,
                    latitude: s.latitude,
                    longitude: s.longitude,
                    imageUrl: `/${(s.id % 12) + 1}.png`,
                    name: `정류장 #${s.id}`,
                    address: s.address,
                    supported_genres: s.supported_genres,
                    capacity: s.capacity,
                    hourly_cost: s.hourly_cost,
                    is_active: s.is_active,
                    current_count: s.current_count,
                }));
                if (!isCancelled) {
                    setFilteredItems(normalized);
                }
            } catch (e) {
                console.error('Failed to fetch genre data:', e);
                if (!isCancelled) {
                    setFilteredItems(stations.filter((s) => s.is_active && matchesCategory(s.supported_genres, category)));
                }
            }
        };

        fetchCategoryData();

        return () => {
            isCancelled = true;
        };
    }, [category, stations]);

    useEffect(() => {
        if (!map) return;
        if (!window.kakao?.maps) {
            console.warn('[kakao] maps sdk not loaded.');
            return;
        }

        markersRef.current.forEach((m) => m.setMap(null));
        markersRef.current = [];
        Object.values(overlaysRef.current).forEach((ov: any) => ov.setMap(null));
        overlaysRef.current = {};

        if (filteredItems.length === 0) return;

        const bounds = new window.kakao.maps.LatLngBounds();

        filteredItems.forEach((item) => {
            const coords = new window.kakao.maps.LatLng(item.latitude, item.longitude);
            
            const confirmedStationId = sessionStorage.getItem('confirmed-station-id');
            const isConfirmed = confirmedStationId && item.id.toString() === confirmedStationId;

            const pinColor = getMarkerColor(item.current_count ?? 0);
            const contentNode = document.createElement('div');
            contentNode.style.position = 'relative';

            const glowHtml = isConfirmed ? `
              <div style="position: absolute; top: -14px; left: -14px; width: 72px; height: 72px; border-radius: 50%; background: ${pinColor}; filter: blur(12px); opacity: 0.5; z-index: -2; pointer-events: none;"></div>
              <div style="position: absolute; top: -6px; left: -6px; width: 56px; height: 56px; border-radius: 50%; background: white; filter: blur(8px); opacity: 0.9; z-index: -1; pointer-events: none;"></div>
            ` : '';

            contentNode.innerHTML = `
              ${glowHtml}
              <div style="
                width: 44px;
                height: 44px;
                background: ${pinColor};
                border-radius: 50% 50% 50% 0;
                transform: rotate(-45deg);
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 2px 2px 6px rgba(0,0,0,0.3);
                border: 2px solid white;
                cursor: pointer;
                position: relative;
                z-index: 1;
              ">
                <div style="transform: rotate(45deg); color: white; font-weight: bold; font-size: 16px;">
                  ${item.current_count ?? 0}
                </div>
              </div>
            `;
            contentNode.onclick = () => {
                if (isConfirmed && mode !== 'artist') {
                    navigate(`/viewer-station/${item.id}`);
                } else {
                    setSelectedPlace(item);
                }
            };

            const markerOverlay = new window.kakao.maps.CustomOverlay({
                position: coords,
                content: contentNode,
                yAnchor: 1.0,
                zIndex: 15,
                clickable: true
            });
            markerOverlay.setMap(map);
            markersRef.current.push(markerOverlay);
            bounds.extend(coords);

            const placeId = placeIdOf(item);
            const count = demandByPlaceId[placeId] ?? 0;
            
            const overlayNode = document.createElement('div');
            overlayNode.innerHTML = overlayHtml(count);
            overlayNode.onclick = () => {
                if (isConfirmed && mode !== 'artist') {
                    navigate(`/viewer-station/${item.id}`);
                } else {
                    setSelectedPlace(item);
                }
            };

            const overlay = new window.kakao.maps.CustomOverlay({
                position: coords,
                content: overlayNode,
                yAnchor: 1.8,
                zIndex: 10,
                clickable: true
            });
            overlay.setMap(map);
            overlaysRef.current[placeId] = overlay;
        });

        map.setBounds(bounds);
    }, [map, filteredItems, demandByPlaceId]);

    const onClick = (new_c: string) => {
        setCategory(new_c);
        setSelectedPlace(null);
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
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <button
                                    type="button"
                                    onClick={() => setSelectedPlace(null)}
                                    style={{ width: 36, height: 36, border: 'none', background: 'transparent', fontSize: 20, cursor: 'pointer' }}
                                    aria-label="back"
                                >
                                    ‹
                                </button>
                                <span style={{ fontSize: 16, fontWeight: 800 }}>장소 정보</span>
                            </div>
                            <button
                                type="button"
                                style={{ width: 36, height: 36, border: 'none', background: 'transparent', fontSize: 18, cursor: 'pointer' }}
                                aria-label="favorite"
                            >
                                ♡
                            </button>
                        </div>

                        <div style={{ width: '100%', height: 180, borderRadius: 16, background: `url(${selectedPlace.imageUrl}) center center/cover no-repeat`, position: 'relative', overflow: 'hidden' }}>
                            <div style={{ position: 'absolute', right: 10, bottom: 10, padding: '4px 8px', borderRadius: 999, fontSize: 12, fontWeight: 700, background: 'rgba(0,0,0,0.45)', color: '#fff' }}>
                                1/6
                            </div>
                        </div>

                        {mode === 'artist' ? (
                            <>
                                <div style={{ padding: '6px 4px 0', display: 'flex', flexDirection: 'column', gap: 8 }}>
                                    <div style={{ fontSize: 16, fontWeight: 900 }}>{selectedPlace.name}</div>
                                    <div style={{ fontSize: 12, color: 'rgba(31,36,48,0.6)', fontWeight: 700 }}>건물 내 공간 · 예약 가능</div>
                                    <div style={{ fontSize: 12, color: 'rgba(31,36,48,0.65)', fontWeight: 700 }}>📍 {selectedPlace.address}</div>
                                    {selectedPlace.hours ? <div style={{ fontSize: 12, color: 'rgba(31,36,48,0.65)', fontWeight: 700 }}>⏰ {selectedPlace.hours}</div> : null}
                                    {selectedPlace.phone ? <div style={{ fontSize: 12, color: 'rgba(31,36,48,0.65)', fontWeight: 700 }}>☎ {selectedPlace.phone}</div> : null}

                                    <div style={{ marginTop: 6, fontSize: 15, fontWeight: 900 }}>공간 정보</div>
                                    <div style={{ fontSize: 11, color: 'rgba(31,36,48,0.45)', fontWeight: 700 }}>이 장소에서 제공하는 공간 및 정보입니다.</div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 4 }}>
                                        <div style={{ background: '#F6F6F8', borderRadius: 10, padding: '10px 12px', fontSize: 12, fontWeight: 700 }}>수용 인원<br /><span style={{ fontSize: 13, fontWeight: 900 }}>최대 {selectedPlace.capacity}명</span></div>
                                        <div style={{ background: '#F6F6F8', borderRadius: 10, padding: '10px 12px', fontSize: 12, fontWeight: 700 }}>지원 장르<br /><span style={{ fontSize: 13, fontWeight: 900 }}>{selectedPlace.supported_genres}</span></div>
                                        <div style={{ background: '#F6F6F8', borderRadius: 10, padding: '10px 12px', fontSize: 12, fontWeight: 700 }}>시간당 비용<br /><span style={{ fontSize: 13, fontWeight: 900 }}>{selectedPlace.hourly_cost.toLocaleString()}원</span></div>
                                        <div style={{ background: '#F6F6F8', borderRadius: 10, padding: '10px 12px', fontSize: 12, fontWeight: 700 }}>활성 상태<br /><span style={{ fontSize: 13, fontWeight: 900 }}>{selectedPlace.is_active ? '예약 가능' : '이용 불가'}</span></div>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => {
                                        if (!selectedPlace) return;
                                        sessionStorage.setItem('artist-place', JSON.stringify(selectedPlace));
                                        navigate('/artist-place', { state: { place: selectedPlace } });
                                    }}
                                    style={{
                                        height: 52,
                                        borderRadius: 16,
                                        border: 'none',
                                        background: '#6C5CE7',
                                        color: '#fff',
                                        fontSize: 18,
                                        fontWeight: 900,
                                        cursor: 'pointer',
                                        marginTop: 4
                                    }}
                                >
                                    공연하기
                                </button>
                            </>
                        ) : (
                            <>
                                <div style={{ padding: '6px 4px 0', display: 'flex', flexDirection: 'column', gap: 8 }}>
                                    <div style={{ fontSize: 16, fontWeight: 900 }}>{selectedPlace.name}</div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'rgba(31,36,48,0.6)', fontWeight: 700 }}>
                                        <span style={{ color: '#F5B301' }}>★</span>
                                        <span>4.6 (128)</span>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12, color: 'rgba(31,36,48,0.65)', fontWeight: 700 }}>
                                        <div>📍 {selectedPlace.address}</div>
                                        {selectedPlace.hours ? <div>⏰ {selectedPlace.hours}</div> : null}
                                        <div>👥 수용 인원 {selectedPlace.capacity}명</div>
                                        <div>🎵 지원 장르 {selectedPlace.supported_genres}</div>
                                        <div>💰 시간당 {selectedPlace.hourly_cost.toLocaleString()}원</div>
                                        {selectedPlace.phone ? <div>☎ {selectedPlace.phone}</div> : null}
                                    </div>

                                    <div style={{ marginTop: 6, background: 'rgba(108, 92, 231, 0.08)', border: '1px solid rgba(108, 92, 231, 0.16)', borderRadius: 14, padding: 12, fontSize: 12, fontWeight: 700, color: 'rgba(31,36,48,0.7)' }}>
                                        안내사항
                                        <div style={{ marginTop: 8, fontSize: 11, fontWeight: 600, color: 'rgba(31,36,48,0.55)', lineHeight: 1.35 }}>
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
                                        setShowSuccessModal(true);
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
                            </>
                        )}
                    </div>
                ) : (
                    filteredItems
                        .map((d) => (
                            <List
                                key={d.id}
                                {...d}
                                info={`장르: ${d.supported_genres} · ${d.capacity}명`}
                                hours={`시간당 ${d.hourly_cost.toLocaleString()}원`}
                                onClick={() => setSelectedPlace(d)}
                            />
                        ))
                )}
            </div>
            {showSuccessModal && (
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.5)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'auto'
                }}>
                    <div style={{
                        background: '#fff', borderRadius: 20, width: 300, padding: 24,
                        display: 'flex', flexDirection: 'column', alignItems: 'center', boxSizing: 'border-box'
                    }}>
                        <div style={{
                            width: 60, height: 60, borderRadius: 30, background: '#6C5CE7',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            marginBottom: 16, color: '#fff', fontSize: 32, fontWeight: 'bold', position: 'relative'
                        }}>
                            ✓
                            <div style={{ position: 'absolute', top: -10, right: -15, color: '#F5B301', fontSize: 24 }}>✦</div>
                            <div style={{ position: 'absolute', top: 5, right: -25, color: '#6C5CE7', fontSize: 18 }}>✦</div>
                        </div>
                        <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>신청이 완료되었습니다!</div>
                        <div style={{ fontSize: 13, color: '#656565', marginBottom: 24, textAlign: 'center' }}>
                            신청이 승인되면 알림과 문자로 안내드릴게요.
                        </div>
                        <button
                            onClick={() => setShowSuccessModal(false)}
                            style={{
                                width: '100%', height: 48, borderRadius: 12, background: '#6C5CE7',
                                color: '#fff', border: 'none', fontSize: 16, fontWeight: 700, cursor: 'pointer'
                            }}
                        >확인</button>
                    </div>
                </div>
            )}
        </div>
    );
}

function Main() {
    const navigate = useNavigate();
    const mapRef = useRef(null);
    const initialMarkersRef = useRef<any[]>([]);
    const selected = modeStore((state) => state.selected);
    const mode = modeStore((state) => state.mode);
    const setSelected = modeStore((state) => state.setSelected);
    const [map, setMap] = useState<any>(null);
    const [stations, setStations] = useState<IList[]>(() => {
        try {
            const cached = sessionStorage.getItem('stations-cache');
            return cached ? JSON.parse(cached) : [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        const fetchStations = async () => {
            const normalize = (rows: StationApi[]) => rows.map((s) => ({
                id: s.id,
                latitude: s.latitude,
                longitude: s.longitude,
                imageUrl: `/${(s.id % 12) + 1}.png`,
                name: `정류장 #${s.id}`,
                address: s.address,
                supported_genres: s.supported_genres,
                capacity: s.capacity,
                hourly_cost: s.hourly_cost,
                is_active: s.is_active,
                current_count: s.current_count,
            }));

            try {
                const res = await getStation();
                const rows: StationApi[] = Array.isArray(res) ? res : (Array.isArray(res?.data) ? res.data : []);
                const normalized = normalize(rows);
                setStations(normalized);
                sessionStorage.setItem('stations-cache', JSON.stringify(normalized));
            } catch (e) {
                console.error('Failed to load stations:', e);
                try {
                    const cached = sessionStorage.getItem('stations-cache');
                    if (cached) {
                        setStations(JSON.parse(cached));
                    }
                } catch (cacheError) {
                    console.error('Failed to read stations cache:', cacheError);
                }
            }
        };
        fetchStations();
    }, []);

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
        if (!map || stations.length === 0) return;
        if (!window.kakao?.maps) return;

        if (selected) {
            initialMarkersRef.current.forEach((m) => m.setMap(null));
            initialMarkersRef.current = [];
            return;
        }

        initialMarkersRef.current.forEach((m) => m.setMap(null));
        initialMarkersRef.current = [];

        const bounds = new window.kakao.maps.LatLngBounds();
        let hasActive = false;

        stations.forEach((station) => {
            if (!station.is_active) return;
            hasActive = true;
            const coords = new window.kakao.maps.LatLng(station.latitude, station.longitude);
            
            const confirmedStationId = sessionStorage.getItem('confirmed-station-id');
            const isConfirmed = confirmedStationId && station.id.toString() === confirmedStationId;

            const pinColor = getMarkerColor(station.current_count ?? 0);
            const contentNode = document.createElement('div');
            contentNode.style.position = 'relative';

            const glowHtml = isConfirmed ? `
              <div style="position: absolute; top: -14px; left: -14px; width: 72px; height: 72px; border-radius: 50%; background: ${pinColor}; filter: blur(12px); opacity: 0.5; z-index: -2; pointer-events: none;"></div>
              <div style="position: absolute; top: -6px; left: -6px; width: 56px; height: 56px; border-radius: 50%; background: white; filter: blur(8px); opacity: 0.9; z-index: -1; pointer-events: none;"></div>
            ` : '';

            contentNode.innerHTML = `
              ${glowHtml}
              <div style="
                width: 44px;
                height: 44px;
                background: ${pinColor};
                border-radius: 50% 50% 50% 0;
                transform: rotate(-45deg);
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 2px 2px 6px rgba(0,0,0,0.3);
                border: 2px solid white;
                cursor: pointer;
                position: relative;
                z-index: 1;
              ">
                <div style="transform: rotate(45deg); color: white; font-weight: bold; font-size: 16px;">
                  ${station.current_count ?? 0}
                </div>
              </div>
            `;
            contentNode.onclick = () => {
                if (isConfirmed) {
                    navigate(`/viewer-station/${station.id}`);
                } else {
                    sessionStorage.setItem('initial-selected-place', JSON.stringify(station));
                    modeStore.getState().setMode('viewer');
                    modeStore.getState().setSelected();
                }
            };

            const overlay = new window.kakao.maps.CustomOverlay({
                position: coords,
                content: contentNode,
                yAnchor: 1.0,
                zIndex: 15,
                clickable: true
            });
            overlay.setMap(map);
            initialMarkersRef.current.push(overlay);
            bounds.extend(coords);
        });

        if (hasActive) {
            map.setBounds(bounds);
        }

        return () => {
            initialMarkersRef.current.forEach((m) => m.setMap(null));
            initialMarkersRef.current = [];
        };
    }, [map, stations, selected]);

    useEffect(() => {
        console.log(selected)
        console.log(mode)
    }, [selected, mode])

    return (
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100vh', minHeight: 0 }}>
            <Header text="문화 정류장" onTitleClick={() => setSelected(false)} />
            <div style={{ width: '100%', flex: 1, overflow: 'hidden', minHeight: 0, position: 'relative' }}>
                <div ref={mapRef} style={{ width: '100%', height: '100%' }} id='map' />
                {selected
                    ? (
                        <div style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none' }}>
                            <ViewerMode map={map} stations={stations} />
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