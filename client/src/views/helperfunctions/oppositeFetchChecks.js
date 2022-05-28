import logout from './logout';
import { Redirect } from 'react-router-dom';

export default function oppositeFetchChecks(str) {
    if (str !== 'not-logged-in') {
        window.location.href = `${(window.location.href.substring(0, (window.location.href.length - window.location.pathname.length)))}/dashboard`;
    } else if (str === 'ERROR') {
        window.location.href = `${(window.location.href.substring(0, (window.location.href.length - window.location.pathname.length)))}/error`;
    }
}
