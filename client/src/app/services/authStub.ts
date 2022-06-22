import { signOut } from "firebase/auth"

export const authStub =  {
    constructor: () => {console.log('constructor called')},
    oAuthProvider: () => {console.log('login called')},
    signInWithGoogle: () => {console.log('logout called')},
    isAnonymous: () => jest.fn(),
    signOut: () => jest.fn()
}