const BASE_URL = "https://khuthon2026-frontend.vercel.app/proxy";

export const signUp = async () => {
    console.log('signUp start');
    const res = await (await fetch(`${BASE_URL}/users`, {
        method: 'POST'
    })).json()
    console.log(res)
    return res;
}