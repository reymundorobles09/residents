export const Auth = () => {
    const auth = JSON.parse(localStorage.getItem('Auth'));
    return auth;
}