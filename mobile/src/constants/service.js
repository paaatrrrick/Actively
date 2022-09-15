const URL_CALL = 'https://www.actively.group/api/'
// const URL_CALL = 'localhost:3001/api/'

const API_CALL = {
    ENDPOINT: 'https://www.actively.group',
    // ENDPOINT: 'localhost:3001',
    login: URL_CALL + '/login',
    showGroups: URL_CALL + '/mobile/showGroups',
    groupMessages: URL_CALL + '/mobile/groupMessages',
    joinGroupByCode: URL_CALL + '/mobile/joinGroupByCode',
    register: URL_CALL + '/register',
    createGroup: URL_CALL + '/creategroup',
}

export default API_CALL;