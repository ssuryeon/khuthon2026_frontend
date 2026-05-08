import backgroundURL from '/Splash_background.svg';

function Splash() {
    return (
        <div style={{width: '100%', height: '100%', background: `url(${backgroundURL}) center top/cover no-repeat`}}></div>
    )
}

export default Splash;