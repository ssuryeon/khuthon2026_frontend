import styled from 'styled-components';
import { userStore } from '../stores/userStore';
import { useNavigate } from 'react-router';

const Page = styled.div`
  height: 100%;
  width: 100%;
  padding: 28px 20px 22px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  background: #fff;
`;

const Hero = styled.div`
  width: 100%;
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 14px;
  padding-bottom: 10px;
`;

const IllustrationPlaceholder = styled.div`
  width: 100%;
  max-width: 320px;
  height: 240px;
  border-radius: 18px;
  background: url('/onboarding_image.png') center center/cover no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(0, 0, 0, 0.35);
  font-weight: 600;
`;

const Headline = styled.div`
  text-align: center;
  margin-top: 10px;
`;

const Title = styled.div`
  font-size: 22px;
  font-weight: 800;
  line-height: 1.25;
  color: #1f2430;
`;

const TitleAccent = styled.span`
  color: #6c5ce7;
`;

const Subtitle = styled.div`
  margin-top: 10px;
  font-size: 13px;
  font-weight: 500;
  color: rgba(31, 36, 48, 0.55);
`;

const ButtonStack = styled.div`
  margin-top: 22px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const SocialButton = styled.button<{ $variant: 'kakao' | 'apple' | 'google' | 'email' }>`
  height: 52px;
  width: 100%;
  border-radius: 14px;
  border: ${(p) => (p.$variant === 'kakao' ? 'none' : '1px solid rgba(0,0,0,0.10)')};
  background: ${(p) => (p.$variant === 'kakao' ? '#FEE500' : '#FFFFFF')};
  color: ${(p) => (p.$variant === 'kakao' ? '#111' : '#1f2430')};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: ${(p) => (p.$variant === 'kakao' ? '0 8px 18px rgba(0,0,0,0.08)' : 'none')};

  &:active {
    transform: translateY(1px);
  }
`;

const IconCircle = styled.span<{ $bg: string; $fg: string }>`
  width: 22px;
  height: 22px;
  border-radius: 999px;
  background: ${(p) => p.$bg};
  color: ${(p) => p.$fg};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 900;
  flex: 0 0 auto;
`;

const Divider = styled.div`
  margin: 14px 0 6px;
  display: flex;
  align-items: center;
  gap: 12px;
  color: rgba(31, 36, 48, 0.35);
  font-size: 12px;
  font-weight: 600;

  &::before,
  &::after {
    content: '';
    height: 1px;
    flex: 1;
    background: rgba(0, 0, 0, 0.08);
  }
`;

const Footer = styled.div`
  margin-top: auto;
  padding-top: 14px;
  text-align: center;
  font-size: 13px;
  font-weight: 500;
  color: rgba(31, 36, 48, 0.6);
`;

const FooterLink = styled.a`
  margin-left: 8px;
  color: #6c5ce7;
  font-weight: 800;
  text-decoration: none;
`;

function Login() {
  const id = userStore((store) => store.user_id);
  const navigate = useNavigate();

  const onClick = async () => {
    if(id) {
      try {
        const res = await import('../utils/station').then(m => m.getStation());
        const rows = Array.isArray(res) ? res : (Array.isArray(res?.data) ? res.data : []);
        const normalized = rows.map((s: any) => ({
            id: s.id,
            latitude: s.latitude,
            longitude: s.longitude,
            imageUrl: '/6.png',
            name: `정류장 #${s.id}`,
            address: s.address,
            supported_genres: s.supported_genres,
            capacity: s.capacity,
            hourly_cost: s.hourly_cost,
            is_active: s.is_active,
            current_count: s.current_count,
        }));
        sessionStorage.setItem('stations-cache', JSON.stringify(normalized));
      } catch (e) {
        console.error('Failed to pre-fetch stations:', e);
      }
      navigate('/main');
    }
    else {
      alert('회원가입을 해주세요.');
      navigate('/signup');
    }
  }

  return (
    <Page>
      <Hero>
        <IllustrationPlaceholder></IllustrationPlaceholder>
      </Hero>

      <Headline>
        <Title>
          우리 동네의 문화를
          <br />
          <TitleAccent>함께 즐겨요</TitleAccent>
        </Title>
        <Subtitle>로그인하고 다양한 공연과 전시를 만나보세요!</Subtitle>
      </Headline>

      <ButtonStack>
        <SocialButton $variant="kakao" type="button">
          <IconCircle $bg="#111" $fg="#FEE500">K</IconCircle>
          카카오로 로그인
        </SocialButton>

        <SocialButton $variant="apple" type="button">
          <IconCircle $bg="#111" $fg="#fff"></IconCircle>
          Apple로 로그인
        </SocialButton>

        <SocialButton $variant="google" type="button">
          <IconCircle $bg="#fff" $fg="#4285F4">G</IconCircle>
          Google로 로그인
        </SocialButton>

        <Divider>또는</Divider>

        <SocialButton $variant="email" type="button" onClick={onClick}>
          <IconCircle $bg="#6C5CE7" $fg="#fff">@</IconCircle>
          이메일로 로그인
        </SocialButton>
      </ButtonStack>

      <Footer>
        아직 계정이 없으신가요?
        <FooterLink href="#" onClick={() => navigate('/signup')}>회원가입!</FooterLink>
      </Footer>
    </Page>
  );
}

export default Login;

