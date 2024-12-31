export const createAuthSlice = (set) => ({
    userinfo: null,
    accessToken: null,
    setUserInfo: (userinfo) => set(
        { userinfo },
        false,
        'setUserInfo'
    ),
    setAccessToken: (accessToken) => set(
        { accessToken },
        false,
        'setAccessToken'
    ),
})