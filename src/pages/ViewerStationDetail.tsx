import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import Menu from '../components/Menu';
import { userStore } from '../stores/userStore';

type PerformanceInfo = {
  stationId: number;
  stationName: string;
  stationAddress: string;
  stationImageUrl: string;
  capacity: number;
  supported_genres: string;
  hourly_cost: number;
  // artist schedule info (from sessionStorage)
  selectedDay: number;
  selectedTime: string;
};

function ViewerStationDetail() {
  const navigate = useNavigate();
  const { stationId } = useParams<{ stationId: string }>();
  const userId = userStore((state) => state.user_id);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [perfInfo, setPerfInfo] = useState<PerformanceInfo | null>(null);

  useEffect(() => {
    // Load station and schedule info from sessionStorage
    try {
      const scheduleRaw = sessionStorage.getItem('artist-schedule');
      const stationsRaw = sessionStorage.getItem('stations-cache');

      let station: any = null;
      if (stationsRaw) {
        const stations = JSON.parse(stationsRaw);
        station = stations.find((s: any) => s.id.toString() === stationId);
      }

      let schedule: any = {};
      if (scheduleRaw) {
        schedule = JSON.parse(scheduleRaw);
      }

      if (station) {
        setPerfInfo({
          stationId: station.id,
          stationName: station.name || `정류장 #${station.id}`,
          stationAddress: station.address || '',
          stationImageUrl: station.imageUrl || `/${(station.id % 12) + 1}.png`,
          capacity: station.capacity || 35,
          supported_genres: station.supported_genres || '어쿠스틱 / 포크',
          hourly_cost: station.hourly_cost || 0,
          selectedDay: schedule?.selectedDay || 24,
          selectedTime: schedule?.selectedTime || '19:00 ~ 20:30',
        });
      }
    } catch {
      // ignore
    }
  }, [stationId]);

  if (!perfInfo) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
        <span>로딩 중...</span>
      </div>
    );
  }

  const timeRange = perfInfo.selectedTime;
  const timeParts = timeRange.split('~').map((t) => t.trim());
  const startHour = parseInt(timeParts[0]?.split(':')[0] || '19', 10);
  const endHour = parseInt(timeParts[1]?.split(':')[0] || '20', 10);
  const durationMin = (endHour - startHour) * 60 || 90;

  const ticketCapacity = Math.floor(perfInfo.capacity * 0.7);
  const watchCapacity = perfInfo.capacity;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100vh', minHeight: 0, background: '#fff' }}>
      {/* Header */}
      <div style={{
        height: 54, borderBottom: '1px solid rgba(0,0,0,0.06)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
        flexShrink: 0
      }}>
        <button
          type="button"
          onClick={() => navigate(-1)}
          style={{ position: 'absolute', left: 8, width: 40, height: 40, border: 'none', background: 'transparent', fontSize: 22, cursor: 'pointer' }}
          aria-label="back"
        >
          ‹
        </button>
        <span style={{ fontSize: 18, fontWeight: 700 }}>장소 정보</span>
        <button
          type="button"
          onClick={() => setIsFavorite(!isFavorite)}
          style={{ position: 'absolute', right: 8, width: 40, height: 40, border: 'none', background: 'transparent', fontSize: 22, cursor: 'pointer', color: isFavorite ? '#E74C3C' : '#999' }}
          aria-label="favorite"
        >
          {isFavorite ? '♥' : '♡'}
        </button>
      </div>

      {/* Scrollable Content */}
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: 0, boxSizing: 'border-box' }}>

        {/* Hero Image */}
        <div style={{
          width: '100%', height: 240,
          background: `linear-gradient(to bottom, rgba(30,20,60,0.25) 0%, transparent 40%), url(${perfInfo.stationImageUrl}) center center/cover no-repeat`,
          position: 'relative'
        }}>
          <div style={{
            position: 'absolute', right: 12, bottom: 12,
            padding: '4px 10px', borderRadius: 999,
            fontSize: 12, fontWeight: 700,
            background: 'rgba(0,0,0,0.45)', color: '#fff'
          }}>
            1/6
          </div>
        </div>

        <div style={{ padding: '16px 20px 24px' }}>

          {/* Title & Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <div style={{ fontSize: 20, fontWeight: 900 }}>{perfInfo.stationName}</div>
            <span style={{
              fontSize: 11, fontWeight: 700,
              background: '#6C5CE7', color: '#fff',
              borderRadius: 6, padding: '3px 8px'
            }}>관람 확정</span>
          </div>
          <div style={{ fontSize: 13, color: '#888', fontWeight: 600, marginBottom: 14 }}>
            어쿠스틱 라이브 공연
          </div>

          {/* Ticket info */}
          <div style={{ display: 'flex', gap: 20, fontSize: 13, fontWeight: 700, color: '#444', marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span>🎫</span>
              <span>예매 인원 <span style={{ color: '#6C5CE7', fontWeight: 900 }}>{ticketCapacity}명</span></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span>👥</span>
              <span>관람 가능 <span style={{ color: '#6C5CE7', fontWeight: 900 }}>{watchCapacity}명</span></span>
            </div>
          </div>

          <div style={{ width: '100%', height: 1, background: 'rgba(0,0,0,0.06)', marginBottom: 20 }} />

          {/* 공연 소개 */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 17, fontWeight: 900, marginBottom: 10 }}>공연 소개</div>
            <div style={{ fontSize: 13, color: '#555', fontWeight: 500, lineHeight: 1.65 }}>
              따뜻한 분위기 속에서 어쿠스틱 기타와 보컬이 어우러지는
              감성적인 라이브 공연입니다.<br />
              일상 속 작은 쉼표가 되어줄 특별한 시간을 함께해 주세요.
            </div>
          </div>

          <div style={{ width: '100%', height: 1, background: 'rgba(0,0,0,0.06)', marginBottom: 20 }} />

          {/* 공연 정보 */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 17, fontWeight: 900, marginBottom: 12 }}>공연 정보</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13, fontWeight: 600, color: '#444' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 16 }}>📅</span>
                <span style={{ color: '#888', width: 50 }}>날짜</span>
                <span style={{ fontWeight: 700 }}>{`2025.05.${perfInfo.selectedDay.toString().padStart(2, '0')} (토)`}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 16 }}>⏰</span>
                <span style={{ color: '#888', width: 50 }}>시간</span>
                <span style={{ fontWeight: 700 }}>{`${timeRange} (${durationMin}분)`}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 16 }}>🎵</span>
                <span style={{ color: '#888', width: 50 }}>장르</span>
                <span style={{ fontWeight: 700 }}>{perfInfo.supported_genres}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 16 }}>📍</span>
                <span style={{ color: '#888', width: 50 }}>장소</span>
                <span style={{ fontWeight: 700 }}>{perfInfo.stationAddress}</span>
              </div>
            </div>
          </div>

          <div style={{ width: '100%', height: 1, background: 'rgba(0,0,0,0.06)', marginBottom: 20 }} />

          {/* 아티스트 소개 */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 17, fontWeight: 900, marginBottom: 12 }}>아티스트 소개</div>
            <div style={{
              display: 'flex', gap: 12, alignItems: 'flex-start',
              background: '#F8F8FA', borderRadius: 14, padding: 14
            }}>
              <div style={{
                width: 56, height: 56, borderRadius: 999, flexShrink: 0,
                background: `url(/3.png) center center/cover no-repeat`,
                border: '2px solid #6C5CE7'
              }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 15, fontWeight: 800 }}>루트 (ROOT)</span>
                  <span style={{
                    fontSize: 10, fontWeight: 700, background: 'rgba(108,92,231,0.12)',
                    color: '#6C5CE7', borderRadius: 6, padding: '2px 7px'
                  }}>어쿠스틱 듀오</span>
                </div>
                <div style={{ fontSize: 12, color: '#666', fontWeight: 500, lineHeight: 1.55 }}>
                  어쿠스틱 기타와 따뜻한 보컬로 일상의 이야기를
                  노래하는 싱어송라이터 듀오. 감성적 멜로디와
                  진솔한 가사로 많은 사랑을 받고 있습니다.
                </div>
              </div>
            </div>
          </div>

          {/* 신청 기간 */}
          <div style={{
            background: '#F8F8FA', borderRadius: 12, padding: '12px 16px',
            fontSize: 13, fontWeight: 600, color: '#666', marginBottom: 16,
            textAlign: 'center'
          }}>
            <span style={{ fontWeight: 700 }}>📋 신청 기간</span>{' '}
            {`2025.05.10 (토) ~ 2025.05.${perfInfo.selectedDay.toString().padStart(2, '0')} (금) 18:00`}
          </div>

          {/* 관람 신청하기 button */}
          <button
            type="button"
            onClick={() => {
              if (userId == null) {
                window.alert('로그인 후 관람 신청이 가능합니다.');
                return;
              }
              setShowSuccessModal(true);
            }}
            style={{
              width: '100%', height: 56, borderRadius: 16,
              border: 'none',
              background: 'linear-gradient(135deg, #6C5CE7 0%, #A78BFA 100%)',
              color: '#fff', fontSize: 18, fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(108,92,231,0.35)',
              transition: 'transform 0.15s, box-shadow 0.15s',
            }}
            onMouseDown={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.97)';
            }}
            onMouseUp={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
            }}
          >
            관람 신청하기
          </button>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{
            background: '#fff', borderRadius: 24, width: 320, padding: 28,
            display: 'flex', flexDirection: 'column', alignItems: 'center', boxSizing: 'border-box',
            boxShadow: '0 20px 60px rgba(0,0,0,0.2)'
          }}>
            <div style={{
              width: 70, height: 70, borderRadius: 35, background: 'linear-gradient(135deg, #6C5CE7, #A78BFA)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 18, color: '#fff', fontSize: 36, fontWeight: 'bold', position: 'relative'
            }}>
              ✓
              <div style={{ position: 'absolute', top: -12, right: -18, color: '#F5B301', fontSize: 26 }}>✦</div>
              <div style={{ position: 'absolute', top: 6, right: -28, color: '#A78BFA', fontSize: 20 }}>✦</div>
            </div>
            <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>관람 신청 완료!</div>
            <div style={{ fontSize: 14, color: '#777', marginBottom: 26, textAlign: 'center', lineHeight: 1.5 }}>
              관람 신청이 완료되었습니다.<br />
              공연 당일 현장에서 체크인 해주세요.
            </div>
            <button
              onClick={() => {
                setShowSuccessModal(false);
                navigate(-1);
              }}
              style={{
                width: '100%', height: 50, borderRadius: 14,
                background: 'linear-gradient(135deg, #6C5CE7, #A78BFA)',
                color: '#fff', border: 'none', fontSize: 17, fontWeight: 700, cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(108,92,231,0.3)'
              }}
            >확인</button>
          </div>
        </div>
      )}

      <Menu />
    </div>
  );
}

export default ViewerStationDetail;
