import { createGlobalStyle } from "styled-components";

const Globalstyle = createGlobalStyle`
    #root, html, body {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        background: #eee;
        margin: 0;
        padding: 0;
        font-family: 'Pretendard', 'sans-serif';
    }

    .app {
        width: 100%;
        max-width: 390px; /* 아이폰 기준 */
        min-height: 844px;
        background: white;
    }

    @media (max-width: 430px) {
        .app {
            max-width: 100%;
        }
    }

    @font-face {
        font-family: 'Pretendard';
        src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/pretendard@1.0/Pretendard-Thin.woff2') format('woff2');
        font-weight: 100;
        font-display: swap;
    }

    @font-face {
        font-family: 'Pretendard';
        src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/pretendard@1.0/Pretendard-ExtraLight.woff2') format('woff2');
        font-weight: 200;
        font-display: swap;
    }

    @font-face {
        font-family: 'Pretendard';
        src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/pretendard@1.0/Pretendard-Light.woff2') format('woff2');
        font-weight: 300;
        font-display: swap;
    }

    @font-face {
        font-family: 'Pretendard';
        src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/pretendard@1.0/Pretendard-Regular.woff2') format('woff2');
        font-weight: 400;
        font-display: swap;
    }

    @font-face {
        font-family: 'Pretendard';
        src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/pretendard@1.0/Pretendard-Medium.woff2') format('woff2');
        font-weight: 500;
        font-display: swap;
    }

    @font-face {
        font-family: 'Pretendard';
        src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/pretendard@1.0/Pretendard-SemiBold.woff2') format('woff2');
        font-weight: 600;
        font-display: swap;
    }

    @font-face {
        font-family: 'Pretendard';
        src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/pretendard@1.0/Pretendard-Bold.woff2') format('woff2');
        font-weight: 700;
        font-display: swap;
    }

    @font-face {
        font-family: 'Pretendard';
        src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/pretendard@1.0/Pretendard-ExtraBold.woff2') format('woff2');
        font-weight: 800;
        font-display: swap;
    }

    @font-face {
        font-family: 'Pretendard';
        src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/pretendard@1.0/Pretendard-Black.woff2') format('woff2');
        font-weight: 900;
        font-display: swap;
    }
`;

export default Globalstyle;