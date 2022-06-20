export const authStub =  {
    constructor: () => jest.fn(),
    oAuthProvider: () => jest.fn(),
    signInWithGoogle: () => jest.fn(),
    getUserDetails: ()=> jest.fn()
}