import AsyncStorage from '@react-native-async-storage/async-storage';

async function getData() {
    try {
        const value = await AsyncStorage.getItem('token');
        if (value !== null) {
            return value;
        }
    } catch (e) {
        return 'Error';
    }
    return 'Error';
}

async function checkAuth() {
    const token = await getData();
    if (token === 'Error') {
        return false;
    }
    return true;
}

export { checkAuth, getData };