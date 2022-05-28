import logout from './logout';

export default function fetchChecks(str) {
    if (str === 'not-logged-in') {
        logout();
    } else if (str === 'ERROR') {
        console.log('handling error')
        window.location.href = `${(window.location.href.substring(0, (window.location.href.length - window.location.pathname.length)))}/error`;
    }
}
