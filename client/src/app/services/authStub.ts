import { signOut } from "firebase/auth"

export const authStub =  {
    constructor: () => jest.fn(),
    oAuthProvider: () => jest.fn(),
    signInWithGoogle: () => jest.fn(),
    getUserDetails: ()=> jest.fn(),
    isAnonymous: () => jest.fn(),
    signOut: () => jest.fn()
}