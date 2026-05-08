import { useMemo, useState } from 'react';
import styled from 'styled-components';
import { signUp } from '../utils/auth';
import {useNavigate} from 'react-router';
import { userStore } from '../stores/userStore';

const Page = styled.div`
  height: 100%;
  width: 100%;
  background: #fff;
  box-sizing: border-box;
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
  font-weight: 800;
  color: rgba(0, 0, 0, 0.86);
`;

const Content = styled.div`
  padding: 8px 20px 18px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const Hero = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

const IllustrationPlaceholder = styled.div`
  width: 100%;
  max-width: 300px;
  height: 190px;
  border-radius: 18px;
  background: linear-gradient(180deg, #ffffff 0%, #f5f7ff 55%, #ffffff 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(0, 0, 0, 0.35);
  font-weight: 700;
`;

const Headline = styled.div`
  text-align: center;
`;

const Title = styled.div`
  font-size: 20px;
  font-weight: 900;
  line-height: 1.25;
  color: #1f2430;
`;

const Accent = styled.span`
  color: #6c5ce7;
`;

const Subtitle = styled.div`
  margin-top: 8px;
  font-size: 12px;
  font-weight: 600;
  color: rgba(31, 36, 48, 0.45);
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const InputRow = styled.div`
  height: 52px;
  border-radius: 14px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  background: #fff;
  display: flex;
  align-items: center;
  padding: 0 12px;
  gap: 10px;
  box-sizing: border-box;
`;

const LeadingIcon = styled.span`
  width: 22px;
  height: 22px;
  border-radius: 999px;
  background: rgba(108, 92, 231, 0.12);
  color: #6c5ce7;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 900;
  flex: 0 0 auto;
`;

const Input = styled.input`
  border: none;
  outline: none;
  width: 100%;
  font-size: 14px;
  font-weight: 600;
  color: rgba(31, 36, 48, 0.9);
  background: transparent;

  &::placeholder {
    color: rgba(31, 36, 48, 0.35);
    font-weight: 700;
  }
`;

const Trailing = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  flex: 0 0 auto;
`;

const Counter = styled.span`
  font-size: 11px;
  font-weight: 800;
  color: rgba(31, 36, 48, 0.35);
`;

const TrailingIconButton = styled.button`
  height: 32px;
  width: 32px;
  border-radius: 10px;
  border: none;
  background: transparent;
  cursor: pointer;
  color: rgba(31, 36, 48, 0.55);
  font-size: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &:active {
    transform: translateY(1px);
  }
`;

const Helper = styled.div`
  font-size: 11px;
  font-weight: 600;
  color: rgba(31, 36, 48, 0.45);
  padding-left: 4px;
`;

const Agreements = styled.div`
  margin-top: 4px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const AgreementRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const AgreementLeft = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  user-select: none;
  font-size: 12px;
  font-weight: 700;
  color: rgba(31, 36, 48, 0.75);
`;

const Checkbox = styled.input`
  width: 16px;
  height: 16px;
  accent-color: #6c5ce7;
`;

const AgreementMeta = styled.span`
  font-size: 11px;
  font-weight: 700;
  color: rgba(31, 36, 48, 0.35);
`;

const ArrowButton = styled.button`
  height: 32px;
  width: 32px;
  border: none;
  background: transparent;
  cursor: pointer;
  color: rgba(31, 36, 48, 0.35);
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &:active {
    transform: translateY(1px);
  }
`;

const PrimaryButton = styled.button`
  height: 54px;
  width: 100%;
  border: none;
  border-radius: 16px;
  background: #6c5ce7;
  color: #fff;
  font-size: 15px;
  font-weight: 900;
  cursor: pointer;
  box-shadow: 0 10px 22px rgba(108, 92, 231, 0.25);
  margin-top: 10px;

  &:active {
    transform: translateY(1px);
  }
`;

const BottomLink = styled.div`
  margin-top: 12px;
  text-align: center;
  font-size: 12px;
  font-weight: 700;
  color: rgba(31, 36, 48, 0.55);
`;

const Link = styled.a`
  margin-left: 8px;
  color: #6c5ce7;
  font-weight: 900;
  text-decoration: none;
`;

function SignUp() {
  const [nickname, setNickname] = useState('');
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [pwVisible, setPwVisible] = useState(false);

  const nicknameCount = useMemo(() => `${Math.min(nickname.length, 10)}/10`, [nickname]);
  const idCount = useMemo(() => `${Math.min(userId.length, 20)}/20`, [userId]);

  const [agreeAll, setAgreeAll] = useState(true);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const navigate = useNavigate();
  const setId = userStore((state) => state.setUserId);


  const onClick = async () => {
    const res = await signUp();
    console.log('signUp: ', res);
    setId(res.id);
    navigate('/main')
  }

  return (
    <Page>
      <TopBar>
        <TopIconButton type="button" aria-label="back">
          ‹
        </TopIconButton>
        <TopTitle>회원가입</TopTitle>
        <TopIconButton type="button" aria-label="close">
          ×
        </TopIconButton>
      </TopBar>

      <Content>
        <Hero>
          <IllustrationPlaceholder>Illustration</IllustrationPlaceholder>
        </Hero>

        <Headline>
          <Title>
            우리 동네의 문화를
            <br />
            <Accent>함께 만들어가요</Accent>
          </Title>
          <Subtitle>간단한 정보로 문화 정류장을 시작하세요!</Subtitle>
        </Headline>

        <Form>
          <Field>
            <InputRow>
              <LeadingIcon>U</LeadingIcon>
              <Input
                placeholder="닉네임"
                value={nickname}
                maxLength={10}
                onChange={(e) => setNickname(e.target.value)}
              />
              <Trailing>
                <Counter>{nicknameCount}</Counter>
              </Trailing>
            </InputRow>
            <Helper>2~10자 이내로 입력해주세요.</Helper>
          </Field>

          <Field>
            <InputRow>
              <LeadingIcon>ID</LeadingIcon>
              <Input
                placeholder="아이디"
                value={userId}
                maxLength={20}
                onChange={(e) => setUserId(e.target.value)}
              />
              <Trailing>
                <Counter>{idCount}</Counter>
              </Trailing>
            </InputRow>
            <Helper>영문, 숫자, 밑줄(_) 포함 4~20자 이내</Helper>
          </Field>

          <Field>
            <InputRow>
              <LeadingIcon>＊</LeadingIcon>
              <Input
                placeholder="비밀번호"
                type={pwVisible ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Trailing>
                <TrailingIconButton
                  type="button"
                  aria-label={pwVisible ? 'hide password' : 'show password'}
                  onClick={() => setPwVisible((v) => !v)}
                >
                  {pwVisible ? '🙈' : '👁'}
                </TrailingIconButton>
              </Trailing>
            </InputRow>
            <Helper>영문, 숫자, 특수문자 포함 8자 이상</Helper>
          </Field>
        </Form>

        <Agreements>
          <AgreementLeft>
            <Checkbox
              type="checkbox"
              checked={agreeAll}
              onChange={(e) => {
                const next = e.target.checked;
                setAgreeAll(next);
                setAgreeTerms(next);
                setAgreePrivacy(next);
              }}
            />
            전체 동의합니다.
          </AgreementLeft>

          <AgreementRow>
            <AgreementLeft>
              <Checkbox
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => {
                  setAgreeTerms(e.target.checked);
                  setAgreeAll(e.target.checked && agreePrivacy);
                }}
              />
              이용약관 동의 <AgreementMeta>(필수)</AgreementMeta>
            </AgreementLeft>
            <ArrowButton type="button" aria-label="terms">
              ›
            </ArrowButton>
          </AgreementRow>

          <AgreementRow>
            <AgreementLeft>
              <Checkbox
                type="checkbox"
                checked={agreePrivacy}
                onChange={(e) => {
                  setAgreePrivacy(e.target.checked);
                  setAgreeAll(e.target.checked && agreeTerms);
                }}
              />
              개인정보 수집 및 이용 동의 <AgreementMeta>(필수)</AgreementMeta>
            </AgreementLeft>
            <ArrowButton type="button" aria-label="privacy">
              ›
            </ArrowButton>
          </AgreementRow>
        </Agreements>

        <div>
          <PrimaryButton type="button" onClick={onClick}>가입하기</PrimaryButton>
          <BottomLink>
            이미 계정이 있으신가요?
            <Link href="/login">로그인</Link>
          </BottomLink>
        </div>
      </Content>
    </Page>
  );
}

export default SignUp;

