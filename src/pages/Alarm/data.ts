export type AlarmItem = {
  id: string;
  title: string;
  body: string;
  timeLabel: string;
  unread: boolean;
  icon: 'bell' | 'ticket' | 'calendar' | 'megaphone' | 'heart' | 'mail' | 'info' | 'gift';
};

export const mockAlarms: AlarmItem[] = [
  {
    id: 'a1',
    title: '신청 완료',
    body: '투썸플레이스 버스킹 공연 신청이\n완료되었습니다.',
    timeLabel: '지금',
    unread: true,
    icon: 'bell',
  },
  {
    id: 'a2',
    title: '공연 승인',
    body: '신청하신 [투썸플레이스] 버스킹 공연이\n승인되었습니다.',
    timeLabel: '10분 전',
    unread: true,
    icon: 'ticket',
  },
  {
    id: 'a3',
    title: '공연 일정 안내',
    body: '5월 30일 (목) 19:00 - 21:00\n투썸플레이스에서 공연이 예정되어 있습니다.',
    timeLabel: '1시간 전',
    unread: true,
    icon: 'calendar',
  },
  {
    id: 'a4',
    title: '정류장 소식',
    body: '석적문화예술회관 소공연장에\n새로운 공연이 등록되었습니다.',
    timeLabel: '3시간 전',
    unread: false,
    icon: 'megaphone',
  },
  {
    id: 'a5',
    title: '관심 공연 알림',
    body: '찜한 공연 [전기적 통쾌한 작은 음악회]가\n내일 오후 7시에 시작됩니다.',
    timeLabel: '어제',
    unread: false,
    icon: 'heart',
  },
  {
    id: 'a6',
    title: '이벤트 안내',
    body: '5월 문화 정류장 이벤트에 참여하고\n선물을 받아가세요!',
    timeLabel: '2일 전',
    unread: false,
    icon: 'mail',
  },
  {
    id: 'a7',
    title: '서비스 안내',
    body: '문화 정류장 서비스 이용약관이\n변경되었습니다.',
    timeLabel: '3일 전',
    unread: false,
    icon: 'info',
  },
  {
    id: 'a8',
    title: '포인트 적립',
    body: '공연 참여로 150P가 적립되었습니다.',
    timeLabel: '5일 전',
    unread: false,
    icon: 'gift',
  },
];

