const BASE_URL = '/api';

export const signUp = async () => {
    console.log('signUp start');
    const res = await (await fetch(`${BASE_URL}/users`, {
        method: 'POST'
    })).json()
    console.log(res)
    return res;
}