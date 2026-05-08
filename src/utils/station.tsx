const BASE_URL = 'http://3.34.183.139:8000';

export const getStation = async () => {
    console.log('getStation start');
    const res = await (await fetch(`${BASE_URL}/station`, {
        method: 'GET'
    })).json();
    console.log(res);
    return res;
}