const BASE_URL = "https://khuthon2026-frontend.vercel.app/proxy";

export const getStation = async () => {
    console.log('getStation start');
    const res = await (await fetch(`${BASE_URL}/stations`, {
        method: 'GET'
    })).json();
    console.log(res);
    return res;
}