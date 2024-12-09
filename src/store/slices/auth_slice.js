export const createAuthSlice = (set) => ({
    userinfo: null,
    setUserInfo: (userinfo) => set(
        { userinfo },
        false,
        'setUserInfo'
    )
})