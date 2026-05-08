import { useMemo, useState } from 'react';
import styled from 'styled-components';
import Menu from '../../components/Menu';
import type { AlarmItem } from './data';
import { mockAlarms } from './data';
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

const ListWrap = styled.div`
  flex: 1;
  min-height: 0;
  padding: 12px 16px 10px;
  box-sizing: border-box;
  overflow: auto;
`;

const Card = styled.div`
  width: 100%;
  border-radius: 14px;
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 10px 18px rgba(0, 0, 0, 0.04);
  padding: 12px 12px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: 12px;

  & + & {
    margin-top: 12px;
  }
`;

const Icon = styled.div<{ $tone: string }>`
  width: 44px;
  height: 44px;
  border-radius: 14px;
  background: ${(p) => p.$tone};
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 1000;
  color: rgba(0, 0, 0, 0.38);
  font-size: 16px;
`;

const CardBody = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const RowTop = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 10px;
`;

const Title = styled.div`
  font-size: 13px;
  font-weight: 900;
  color: rgba(31, 36, 48, 0.88);
`;

const Time = styled.div`
  font-size: 11px;
  font-weight: 800;
  color: rgba(31, 36, 48, 0.35);
  white-space: nowrap;
`;

const Body = styled.div`
  font-size: 12px;
  font-weight: 700;
  color: rgba(31, 36, 48, 0.55);
  white-space: pre-line;
  line-height: 1.25;
`;

const UnreadDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: #6c5ce7;
  flex: 0 0 auto;
`;

const FooterHint = styled.div`
  text-align: center;
  margin-top: 14px;
  font-size: 11px;
  font-weight: 700;
  color: rgba(31, 36, 48, 0.3);
`;

function iconTone(icon: AlarmItem['icon']) {
  switch (icon) {
    case 'bell':
      return 'rgba(108, 92, 231, 0.12)';
    case 'ticket':
      return 'rgba(255, 189, 46, 0.18)';
    case 'calendar':
      return 'rgba(46, 204, 113, 0.14)';
    case 'megaphone':
      return 'rgba(52, 152, 219, 0.14)';
    case 'heart':
      return 'rgba(231, 76, 60, 0.12)';
    case 'mail':
      return 'rgba(155, 89, 182, 0.12)';
    case 'info':
      return 'rgba(149, 165, 166, 0.18)';
    case 'gift':
      return 'rgba(230, 126, 34, 0.14)';
    default:
      return 'rgba(0, 0, 0, 0.08)';
  }
}

function iconLetter(icon: AlarmItem['icon']) {
  switch (icon) {
    case 'bell':
      return '🔔';
    case 'ticket':
      return '🎫';
    case 'calendar':
      return '📅';
    case 'megaphone':
      return '📣';
    case 'heart':
      return '❤️';
    case 'mail':
      return '✉️';
    case 'info':
      return 'ℹ️';
    case 'gift':
      return '🎁';
    default:
      return '•';
  }
}

function Alarm() {
  const [tab, setTab] = useState<'all' | 'read'>('all');
  const navigate = useNavigate();

  const items = useMemo(() => {
    if (tab === 'read') return mockAlarms.filter((a) => !a.unread);
    return mockAlarms;
  }, [tab]);

  return (
    <Page>
      <TopBar>
        <TopIconButton type="button" aria-label="back" onClick={() => navigate(-1)}>
          ‹
        </TopIconButton>
        <TopTitle>알림</TopTitle>
        <TopIconButton type="button" aria-label="close">
          ×
        </TopIconButton>
      </TopBar>

      <Tabs>
        <TabButton type="button" $active={tab === 'all'} onClick={() => setTab('all')}>
          전체
        </TabButton>
        <TabButton type="button" $active={tab === 'read'} onClick={() => setTab('read')}>
          읽은 알림
        </TabButton>
      </Tabs>

      <ListWrap>
        {items.map((a) => (
          <Card key={a.id}>
            <Icon $tone={iconTone(a.icon)}>{iconLetter(a.icon)}</Icon>
            <CardBody>
              <RowTop>
                <Title>{a.title}</Title>
                <Time>{a.timeLabel}</Time>
              </RowTop>
              <Body>{a.body}</Body>
            </CardBody>
            {a.unread ? <UnreadDot /> : null}
          </Card>
        ))}
        <FooterHint>알림은 최대 30일간 보관됩니다.</FooterHint>
      </ListWrap>

      <Menu />
    </Page>
  );
}

export default Alarm;

