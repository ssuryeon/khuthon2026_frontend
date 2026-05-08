const fs = require('fs');
const content = fs.readFileSync('/Users/jeongsupyo/Downloads/KHU/26-1_khuthon/khuthon2026_frontend/src/pages/Main.tsx', 'utf-8');

let newContent = content.replace("import { userStore } from '../stores/userStore';", "import { userStore } from '../stores/userStore';\nimport { getStation } from '../utils/station';");

newContent = newContent.replace(
  "onClick={() => {setMode('renter'); setSelected()}}",
  "onClick={() => {}}"
);

const viewerModeStart = newContent.indexOf('function ViewerMode({ map }: { map: any }) {');
const viewerModeEnd = newContent.indexOf('function Main() {');

let viewerModeContent = newContent.substring(viewerModeStart, viewerModeEnd);

// Add state for dbStations and showSuccessModal
viewerModeContent = viewerModeContent.replace(
  "const userId = userStore((state) => state.user_id);",
  `const userId = userStore((state) => state.user_id);
    const [dbStations, setDbStations] = useState<any[]>([]);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    useEffect(() => {
        getStation().then(data => setDbStations(data)).catch(console.error);
    }, []);`
);

// Modify addMarkersAndFitBounds
const addMarkersStart = viewerModeContent.indexOf('const addMarkersAndFitBounds = (items: IList[]) => {');
const addMarkersEnd = viewerModeContent.indexOf('switch (new_c) {');
const oldAddMarkers = viewerModeContent.substring(addMarkersStart, addMarkersEnd);

const newAddMarkers = `const addMarkersAndFitBounds = (items: IList[]) => {
            const bounds = new window.kakao.maps.LatLngBounds();
            let dbOk = false;

            dbStations.forEach((station: any) => {
                let match = false;
                if (new_c === 'display' && station.supported_genres.includes('전시')) match = true;
                if (new_c === 'music_concert' && station.supported_genres.includes('음악')) match = true;
                if (new_c === 'viewing_concert' && station.supported_genres.includes('관람')) match = true;
                
                if (match) {
                    const coords = new window.kakao.maps.LatLng(station.latitude, station.longitude);
                    const redMarkerHtml = \`
                      <div style="
                        width: 44px;
                        height: 44px;
                        background: #EA4335;
                        border-radius: 50% 50% 50% 0;
                        transform: rotate(-45deg);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        box-shadow: 2px 2px 6px rgba(0,0,0,0.3);
                        border: 2px solid white;
                      ">
                        <div style="transform: rotate(45deg); color: white; font-weight: bold; font-size: 16px;">
                          \${station.current_count}
                        </div>
                      </div>
                    \`;

                    const dbOverlay = new window.kakao.maps.CustomOverlay({
                        position: coords,
                        content: redMarkerHtml,
                        yAnchor: 1.0,
                        zIndex: 15,
                    });
                    dbOverlay.setMap(map);
                    overlaysRef.current['db_' + station.id] = dbOverlay;
                    bounds.extend(coords);
                    dbOk = true;
                }
            });

            if (items.length === 0 && !dbOk) return;

            let pending = items.length;
            let okCount = 0;

            if (pending === 0 && dbOk) {
                map.setBounds(bounds);
                return;
            }

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
                    if (pending === 0 && (okCount > 0 || dbOk)) {
                        map.setBounds(bounds);
                    }
                });
            });
        };
        `;
viewerModeContent = viewerModeContent.replace(oldAddMarkers, newAddMarkers);

// Add showSuccessModal = true and the Modal JSX
viewerModeContent = viewerModeContent.replace(
  "return next;\n                        });\n                      }}\n                      style={{",
  `return next;
                        });
                        setShowSuccessModal(true);
                      }}
                      style={{`
);

const modalJsx = `
            {/* 리스트 영역 */}
            {showSuccessModal && (
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.5)', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <div style={{
                        background: '#fff', borderRadius: 20, width: 300, padding: 24,
                        display: 'flex', flexDirection: 'column', alignItems: 'center', boxSizing: 'border-box'
                    }}>
                        <div style={{
                            width: 60, height: 60, borderRadius: 30, background: '#6C5CE7',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            marginBottom: 16, color: '#fff', fontSize: 32, fontWeight: 'bold'
                        }}>✓</div>
                        <div style={{fontSize: 18, fontWeight: 800, marginBottom: 8}}>신청이 완료되었습니다!</div>
                        <div style={{fontSize: 13, color: '#656565', marginBottom: 24, textAlign: 'center'}}>
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
            )}`;

viewerModeContent = viewerModeContent.replace("{/* 리스트 영역 */}", modalJsx);

newContent = newContent.substring(0, viewerModeStart) + viewerModeContent + newContent.substring(viewerModeEnd);

fs.writeFileSync('/Users/jeongsupyo/Downloads/KHU/26-1_khuthon/khuthon2026_frontend/src/pages/Main.tsx', newContent);
console.log('patched successfully');
