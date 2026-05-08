import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import Menu from '../components/Menu';

type Place = {
  id?: number;
  latitude?: number;
  longitude?: number;
  imageUrl?: string;
  name?: string;
  address?: string;
  phone?: string;
  hours?: string;
  supported_genres?: string;
  capacity?: number;
  hourly_cost?: number;
  is_active?: boolean;
};

function ArtistPlace() {
  const navigate = useNavigate();
  const location = useLocation();
  const placeFromState: Place | undefined = location.state?.place;
  const placeFromSession: Place | undefined = (() => {
    try {
      const raw = sessionStorage.getItem('artist-place');
      return raw ? JSON.parse(raw) : undefined;
    } catch {
      return undefined;
    }
  })();
  const place: Place | undefined = placeFromState ?? placeFromSession;
  const [selectedDay, setSelectedDay] = useState(24);
  const [selectedTime, setSelectedTime] = useState('19:00 ~ 20:00');

  const timeSlots = useMemo(
    () => [
      '09:00 ~ 10:00',
      '10:00 ~ 11:00',
      '11:00 ~ 12:00',
      '13:00 ~ 14:00',
      '14:00 ~ 15:00',
      '15:00 ~ 16:00',
      '16:00 ~ 17:00',
      '17:00 ~ 18:00',
      '18:00 ~ 19:00',
      '19:00 ~ 20:00',
      '20:00 ~ 21:00',
      '21:00 ~ 22:00',
    ],
    [],
  );

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
        <span style={{ fontSize: 20, fontWeight: 600 }}>공연 일정 선택</span>
      </div>

      <div style={{ width: '100%', flex: 1, minHeight: 0, overflowY: 'auto', background: '#fff', padding: 12, boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', gap: 12, border: '1px solid rgba(0,0,0,0.07)', borderRadius: 14, padding: 10, boxSizing: 'border-box' }}>
          <div
            style={{
              width: 88,
              height: 88,
              borderRadius: 10,
              flexShrink: 0,
              background: `url(${place?.imageUrl || '/6.png'}) center center/cover no-repeat`,
              backgroundColor: '#ECECEC',
            }}
          />
          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 5 }}>
            <div style={{ fontWeight: 600, fontSize: 20 }}>{place?.name || '장소 정보'}</div>
            <div style={{ fontSize: 12, color: '#656565', fontWeight: 700 }}>{place?.address || '-'}</div>
            <div style={{ fontSize: 12, color: '#656565', fontWeight: 700 }}>{place?.hours || '운영시간 정보 없음'}</div>
          </div>
        </div>

        <div style={{ marginTop: 16, fontSize: 20, fontWeight: 600 }}>날짜 선택</div>
        <div style={{ marginTop: 8, border: '1px solid rgba(0,0,0,0.08)', borderRadius: 14, padding: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <button type="button" style={{ border: 'none', background: 'transparent', fontSize: 22, color: '#666', cursor: 'pointer' }}>‹</button>
            <div style={{ fontSize: 20, fontWeight: 600 }}>2025년 5월</div>
            <button type="button" style={{ border: 'none', background: 'transparent', fontSize: 22, color: '#666', cursor: 'pointer' }}>›</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8, textAlign: 'center', fontSize: 13, color: '#666', fontWeight: 700 }}>
            {['일', '월', '화', '수', '목', '금', '토'].map((d) => (
              <div key={d}>{d}</div>
            ))}
            {[27, 28, 29, 30, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31].map((day, idx) => {
              const active = day === selectedDay && idx >= 28;
              return (
                <button
                  key={`${day}-${idx}`}
                  type="button"
                  onClick={() => idx >= 28 && setSelectedDay(day)}
                  style={{
                    height: 32,
                    borderRadius: 999,
                    border: 'none',
                    background: active ? '#6C5CE7' : 'transparent',
                    color: active ? '#fff' : idx < 4 ? '#bbb' : '#222',
                    fontWeight: active ? 700 : 600,
                    cursor: idx >= 28 ? 'pointer' : 'default',
                  }}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ marginTop: 16, fontSize: 22, fontWeight: 700 }}>시간 선택</div>
        <div style={{ marginTop: 8, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {timeSlots.map((slot) => {
            const active = slot === selectedTime;
            return (
              <button
                key={slot}
                type="button"
                onClick={() => setSelectedTime(slot)}
                style={{
                  height: 38,
                  borderRadius: 8,
                  border: `1px solid ${active ? '#6C5CE7' : 'rgba(0,0,0,0.12)'}`,
                  background: active ? '#6C5CE7' : '#fff',
                  color: active ? '#fff' : '#444',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {slot}
              </button>
            );
          })}
        </div>

        <div style={{ marginTop: 14, borderRadius: 10, background: 'rgba(31,36,48,0.04)', border: '1px solid rgba(0,0,0,0.06)', padding: '10px 12px', fontSize: 11, fontWeight: 700, color: 'rgba(31,36,48,0.65)' }}>
          ⓘ 공연 시간은 최소 1시간에서 최대 2시간까지 선택 가능합니다.
        </div>

        <button
          type="button"
          onClick={() => {
            if (!place) return;
            const payload = {
              place,
              selectedDay,
              selectedTime,
            };
            sessionStorage.setItem('artist-schedule', JSON.stringify(payload));
            navigate('/artist-confirm', { state: payload });
          }}
          style={{
            height: 54,
            borderRadius: 14,
            border: 'none',
            background: '#6C5CE7',
            color: '#fff',
            fontSize: 20,
            fontWeight: 600,
            cursor: 'pointer',
            width: '100%',
            marginTop: 14,
          }}
        >
          공연하기
        </button>
      </div>
      <Menu />
    </div>
  );
}

export default ArtistPlace;

