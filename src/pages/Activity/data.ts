export type BookingStatus =
  | '예매 확정'
  | '관람 완료'
  | '취소 완료'
  | '참여 완료'
  | '참여 취소';

export type BookingItem = {
  id: string;
  status: BookingStatus;
  title: string;
  subtitle: string;
  dateTime: string;
  location: string;
  imageUrl: string;
  reservedAt: string;
  actionLabel: string;
};

export const bookedMock: BookingItem[] = [
  {
    id: 'b1',
    status: '예매 확정',
    title: '전기적 통쾌한 작은 음악회',
    subtitle: '아주스틱 공연',
    dateTime: '2024.05.30 (목) 19:30',
    location: '진가재 북카페 (강변대로 1527)',
    imageUrl: '/6.png',
    reservedAt: '예매일 | 2024.05.20 (월) 14:32',
    actionLabel: '상세보기',
  },
  {
    id: 'b2',
    status: '예매 확정',
    title: '재즈 인 더 나잇',
    subtitle: '재즈 트리오 공연',
    dateTime: '2024.06.07 (금) 20:00',
    location: '석적문화예술회관 소공연장',
    imageUrl: '/3.png',
    reservedAt: '예매일 | 2024.05.18 (토) 11:09',
    actionLabel: '상세보기',
  },
  {
    id: 'b3',
    status: '관람 완료',
    title: '소곤소곤 클래식',
    subtitle: '피아노 & 월별 듀오',
    dateTime: '2024.05.10 (금) 19:30',
    location: '아트갤러리 석적',
    imageUrl: '/4.png',
    reservedAt: '예매일 | 2024.04.28 (일) 09:41',
    actionLabel: '관람 후기 작성',
  },
  {
    id: 'b4',
    status: '취소 완료',
    title: '봄날의 피아노',
    subtitle: '피아노 독주회',
    dateTime: '2024.05.17 (금) 19:30',
    location: '석적문화예술회관 소공연장',
    imageUrl: '/3.png',
    reservedAt: '취소일 | 2024.05.15 (수) 16:20',
    actionLabel: '상세보기',
  },
];

export const joinedMock: BookingItem[] = [
  {
    id: 'j1',
    status: '참여 완료',
    title: '성촌 버스킹 in 석적',
    subtitle: '지역 청년 아티스트 무대',
    dateTime: '2024.05.18 (토) 17:00',
    location: '석적문화예술회관 야외광장',
    imageUrl: '/8.png',
    reservedAt: '참여일 | 2024.05.18 (토)',
    actionLabel: '활동 인증 보기',
  },
  {
    id: 'j2',
    status: '참여 완료',
    title: '남율공원 힐링 음악회',
    subtitle: '어쿠스틱 버스킹',
    dateTime: '2024.04.27 (토) 18:30',
    location: '남율공원 야외무대',
    imageUrl: '/5.png',
    reservedAt: '참여일 | 2024.04.27 (토)',
    actionLabel: '활동 인증 보기',
  },
  {
    id: 'j3',
    status: '참여 취소',
    title: '문화가 있는 날 오픈마이크',
    subtitle: '누구나 참여 무대',
    dateTime: '2024.05.24 (금) 19:00',
    location: '청년문화센터 다목적홀',
    imageUrl: '/9.png',
    reservedAt: '신청일 | 2024.05.20 (월)',
    actionLabel: '신청 내역 보기',
  },
];

