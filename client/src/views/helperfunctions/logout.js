export default function logout() {
    console.log('logging out')
    window.localStorage.removeItem('token');
    window.location.href = `${(window.location.href.substring(0, (window.location.href.length - window.location.pathname.length)))}/login`;
}
