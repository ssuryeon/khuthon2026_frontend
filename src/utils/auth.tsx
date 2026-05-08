const BASE_URL = 'http://3.34.183.139:8000';

export const signUp = async () => {
    console.log('signUp start');
    const res = await (await fetch(`${BASE_URL}/users`, {
        method: 'POST'
    })).json()
    console.log(res)
    return res;
}