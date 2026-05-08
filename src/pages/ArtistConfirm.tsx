import { useLocation, useNavigate } from 'react-router';
import Menu from '../components/Menu';
import { modeStore } from '../stores/userStore';

type ConfirmPayload = {
  place?: {
    id?: number;
    imageUrl?: string;
    name?: string;
    address?: string;
    supported_genres?: string;
    capacity?: number;
  };
  selectedDay?: number;
  selectedTime?: string;
};

function ArtistConfirm() {
  const navigate = useNavigate();
  const location = useLocation();
  const setMode = modeStore((state) => state.setMode);

  const fromState = location.state as ConfirmPayload | undefined;
  const fromSession: ConfirmPayload | undefined = (() => {
    try {
      const raw = sessionStorage.getItem('artist-schedule');
      return raw ? JSON.parse(raw) : undefined;
    } catch {
      return undefined;
    }
  })();

  const payload = fromState ?? fromSession ?? {};
  const place = payload.place;
  const time = payload.selectedTime ?? '19:00 ~ 20:00';
  const day = payload.selectedDay ?? 24;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100vh', minHeight: 0 }}>
      <div style={{ height: 54, borderBottom: '1px solid rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <button
          type="button"
          onClick={() => navigate(-1)}
          style={{ position: 'absolute', left: 8, width: 40, height: 40, border: 'none', background: 'transparent', fontSize: 22, cursor: 'pointer' }}
          aria-label="back"
        >
          ‹
        </button>
        <span style={{ fontSize: 20, fontWeight: 600 }}>공연 확정</span>
      </div>

      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', background: '#fff', padding: 12, boxSizing: 'border-box' }}>
        <div style={{ border: '1px solid rgba(0,0,0,0.08)', borderRadius: 16, padding: 16 }}>
          <div style={{ width: 110, height: 110, margin: '0 auto', borderRadius: 999, background: 'rgba(46, 204, 113, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#20a55b', fontSize: 66, fontWeight: 900 }}>
            ✓
          </div>
          <div style={{ textAlign: 'center', fontSize: 20, fontWeight: 600, color: '#20a55b', marginTop: 10 }}>공연이 확정되었습니다!</div>
          <div style={{ textAlign: 'center', fontSize: 14, color: '#555', fontWeight: 600, marginTop: 6, lineHeight: 1.4 }}>
            아래 내용으로 공연이 확정되었어요.
            <br />
            관객들이 공연을 신청할 수 있어요.
          </div>

          <div style={{ marginTop: 14, border: '1px solid rgba(0,0,0,0.07)', borderRadius: 12, padding: 10, display: 'flex', gap: 10 }}>
            <div style={{ width: 70, height: 70, borderRadius: 10, background: `url(${place?.imageUrl || '/6.png'}) center center/cover no-repeat`, backgroundColor: '#eee' }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 20, fontWeight: 600 }}>{place?.name || '장소 정보'}</div>
              <div style={{ fontSize: 12, color: '#666', fontWeight: 600, marginTop: 4 }}>{place?.address || '-'}</div>
            </div>
          </div>

          <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: '100px 1fr', rowGap: 8, columnGap: 10, fontSize: 13, fontWeight: 700, color: '#444' }}>
            <div>📅 공연 일시</div>
            <div>{`2025.05.${day.toString().padStart(2, '0')} (토) ${time}`}</div>
            <div>⏱ 공연 시간</div>
            <div>60분</div>
            <div>🎤 공연 유형</div>
            <div>{place?.supported_genres || '어쿠스틱 / 포크'}</div>
            <div>👥 수용 인원</div>
            <div>{`최대 ${place?.capacity ?? 35}명`}</div>
          </div>

          <div style={{ marginTop: 12, borderRadius: 10, background: 'rgba(31,36,48,0.04)', border: '1px solid rgba(0,0,0,0.06)', padding: '10px 12px', fontSize: 12, fontWeight: 700, color: 'rgba(31,36,48,0.65)', lineHeight: 1.45 }}>
            ⓘ 관객의 관람 신청을 확인할 수 있습니다.
            <br />• 공연 당일에는 현장 체크 후 공연을 진행해주세요.
            <br />• 공연 관리 메뉴에서 공연 정보를 확인할 수 있습니다.
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            if (place?.id) {
              sessionStorage.setItem('confirmed-station-id', place.id.toString());
            }
            setMode('artist');
            navigate('/main');
          }}
          style={{ height: 54, borderRadius: 14, border: 'none', background: '#6C5CE7', color: '#fff', fontSize: 20, fontWeight: 600, cursor: 'pointer', width: '100%', marginTop: 14 }}
        >
          확인
        </button>

        <button
          type="button"
          onClick={() => navigate('/activity')}
          style={{ height: 54, borderRadius: 14, border: '1px solid #6C5CE7', background: '#fff', color: '#6C5CE7', fontSize: 20, fontWeight: 600, cursor: 'pointer', width: '100%', marginTop: 10 }}
        >
          내 활동에서 보기
        </button>
      </div>

      <Menu />
    </div>
  );
}

export default ArtistConfirm;

