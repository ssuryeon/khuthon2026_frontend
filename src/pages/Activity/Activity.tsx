import { useMemo, useState } from 'react';
import styled from 'styled-components';
import Menu from '../../components/Menu';
import type { BookingItem } from './data';
import { bookedMock, joinedMock } from './data';
import { useNavigate } from 'react-router';

const Page = styled.div`
  height: 100%;
  width: 100%;
  background: #fff;
  display: flex;
  flex-direction: column;
`;

const TopBar = styled.div`
  height: 54px;
  flex: 0 0 auto;
  display: grid;
  grid-template-columns: 44px 1fr 44px;
  align-items: center;
  padding: 0 8px;
  box-sizing: border-box;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
`;

const TopIconButton = styled.button`
  height: 44px;
  width: 44px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 20px;
  color: rgba(0, 0, 0, 0.7);
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &:active {
    transform: translateY(1px);
  }
`;

const TopTitle = styled.div`
  text-align: center;
  font-size: 16px;
  font-weight: 900;
  color: rgba(0, 0, 0, 0.86);
`;

const Tabs = styled.div`
  height: 46px;
  flex: 0 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: end;
  box-sizing: border-box;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
`;

const TabButton = styled.button<{ $active: boolean }>`
  height: 46px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 13px;
  font-weight: 900;
  color: ${(p) => (p.$active ? '#6C5CE7' : 'rgba(31, 36, 48, 0.45)')};
  position: relative;

  &::after {
    content: '';
    position: absolute;
    left: 18%;
    right: 18%;
    bottom: 0;
    height: 3px;
    border-radius: 999px;
    background: ${(p) => (p.$active ? '#6C5CE7' : 'transparent')};
  }
`;

const Body = styled.div`
  flex: 1;
  min-height: 0;
  overflow: auto;
  padding: 14px 16px 16px;
  box-sizing: border-box;
`;

const SectionTitleRow = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin: 2px 2px 10px;
`;

const SectionTitle = styled.div`
  font-size: 14px;
  font-weight: 900;
  color: rgba(31, 36, 48, 0.88);
`;

const SectionMeta = styled.div`
  font-size: 12px;
  font-weight: 800;
  color: rgba(31, 36, 48, 0.35);
`;

const Card = styled.div`
  width: 100%;
  border-radius: 16px;
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 10px 18px rgba(0, 0, 0, 0.04);
  padding: 12px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 10px;

  & + & {
    margin-top: 12px;
  }
`;

const StatusPill = styled.div<{ $tone: 'purple' | 'gray' | 'green' }>`
  align-self: flex-start;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 900;
  background: ${(p) =>
    p.$tone === 'purple'
      ? 'rgba(108, 92, 231, 0.12)'
      : p.$tone === 'green'
        ? 'rgba(46, 204, 113, 0.14)'
        : 'rgba(31, 36, 48, 0.06)'};
  color: ${(p) =>
    p.$tone === 'purple'
      ? '#6C5CE7'
      : p.$tone === 'green'
        ? '#1E9D57'
        : 'rgba(31, 36, 48, 0.55)'};
`;

const MainRow = styled.div`
  display: flex;
  gap: 12px;
  align-items: flex-start;
`;

const Thumb = styled.div<{ $url: string }>`
  width: 72px;
  height: 72px;
  border-radius: 14px;
  flex: 0 0 auto;
  background: ${(p) => `url(${p.$url}) center center/cover no-repeat`};
  background-color: #e7e7e7;
`;

const Info = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Title = styled.div`
  font-size: 13px;
  font-weight: 1000;
  color: rgba(31, 36, 48, 0.9);
  line-height: 1.25;
`;

const Subtitle = styled.div`
  font-size: 12px;
  font-weight: 800;
  color: rgba(31, 36, 48, 0.55);
`;

const MetaLine = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 11px;
  font-weight: 750;
  color: rgba(31, 36, 48, 0.45);
`;

const ActionRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const ReservedAt = styled.div`
  font-size: 10.5px;
  font-weight: 800;
  color: rgba(31, 36, 48, 0.35);
`;

const ActionButton = styled.button`
  height: 32px;
  padding: 0 12px;
  border-radius: 999px;
  border: 1px solid rgba(108, 92, 231, 0.35);
  background: #fff;
  color: #6c5ce7;
  font-size: 11px;
  font-weight: 900;
  cursor: pointer;

  &:active {
    transform: translateY(1px);
  }
`;

const Notice = styled.div`
  margin-top: 14px;
  border-radius: 16px;
  background: rgba(31, 36, 48, 0.04);
  border: 1px solid rgba(0, 0, 0, 0.06);
  padding: 12px 12px;
  box-sizing: border-box;
  color: rgba(31, 36, 48, 0.6);
  font-size: 11px;
  font-weight: 700;
  line-height: 1.35;
`;

function toneFor(status: BookingItem['status']): 'purple' | 'gray' | 'green' {
  if (status === '예매 확정') return 'purple';
  if (status === '참여 완료') return 'green';
  return 'gray';
}

function BookingCard({ item }: { item: BookingItem }) {
  return (
    <Card>
      <StatusPill $tone={toneFor(item.status)}>{item.status}</StatusPill>

      <MainRow>
        <Thumb $url={item.imageUrl} />
        <Info>
          <Title>{item.title}</Title>
          <Subtitle>{item.subtitle}</Subtitle>
          <MetaLine>
            <div>🗓 {item.dateTime}</div>
            <div>📍 {item.location}</div>
          </MetaLine>
        </Info>
      </MainRow>

      <ActionRow>
        <ReservedAt>{item.reservedAt}</ReservedAt>
        <ActionButton type="button">{item.actionLabel}</ActionButton>
      </ActionRow>
    </Card>
  );
}

function Activity() {
  const [tab, setTab] = useState<'booked' | 'joined'>('booked');
  const navigate = useNavigate();

  const items = useMemo(() => (tab === 'booked' ? bookedMock : joinedMock), [tab]);

  return (
    <Page>
      <TopBar>
        <TopIconButton type="button" aria-label="back" onClick={() => navigate(-1)}>
          ‹
        </TopIconButton>
        <TopTitle>내 활동</TopTitle>
        <TopIconButton type="button" aria-label="close">
          ×
        </TopIconButton>
      </TopBar>

      <Tabs>
        <TabButton type="button" $active={tab === 'booked'} onClick={() => setTab('booked')}>
          예매한 공연
        </TabButton>
        <TabButton type="button" $active={tab === 'joined'} onClick={() => setTab('joined')}>
          참여한 공연
        </TabButton>
      </Tabs>

      <Body>
        <SectionTitleRow>
          <SectionTitle>{tab === 'booked' ? '예매 내역' : '참여한 공연'}</SectionTitle>
          <SectionMeta>총 {items.length}건</SectionMeta>
        </SectionTitleRow>

        {items.map((it) => (
          <BookingCard key={it.id} item={it} />
        ))}

        {tab === 'booked' ? (
          <Notice>
            ⓘ 안내사항
            <br />- 예매한 공연은 공연 1시간 전까지 취소할 수 있습니다.
            <br />- 관람 완료 후 공연은 환불이 불가합니다.
            <br />- 취소 내역은 예매일 기준 7일간 확인할 수 있습니다.
          </Notice>
        ) : (
          <Notice>
            ⓘ 안내사항
            <br />- 참여한 공연의 활동 인증을 확인하고 공유할 수 있습니다.
            <br />- 참여 취소된 공연은 ‘신청 내역 보기’에서 확인합니다.
            <br />- 활동 인증은 공연 종료 후 24시간 이내에 제공됩니다.
          </Notice>
        )}
      </Body>

      <Menu />
    </Page>
  );
}

export default Activity;

