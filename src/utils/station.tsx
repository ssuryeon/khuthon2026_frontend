const BASE_URL = "https://khuthon2026-frontend.vercel.app/proxy";

export const getStation = async (genre?: string) => {
    console.log('getStation start');
    const url = genre ? `${BASE_URL}/stations?genre=${encodeURIComponent(genre)}` : `${BASE_URL}/stations`;
    const res = await (await fetch(url, {
        method: 'GET'
    })).json();
    console.log(res);
    return res;
}

export const getCount = async (id:number, genre:string) => {
    console.log('getCount start');
    const res = await (await fetch(`${BASE_URL}/stations/${id}/checkin-count?genre=${genre}`)).json()
    console.log(res);
    return res;
}