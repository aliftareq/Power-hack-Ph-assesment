import React, { createContext, useEffect, useState } from 'react';
import { createUserWithEmailAndPassword, getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from 'firebase/auth'
import app from '../Firebase/firebase.config';

export const AuthContext = createContext()

const auth = getAuth(app)

//providers
const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
    //states
    const [user, setUser] = useState(null)
    const [loading, setloading] = useState(true)

    //handlers
    const createUser = (email, password) => {
        setloading(true)
        return createUserWithEmailAndPassword(auth, email, password)
    }

    const updateUser = (userInfo) => {
        setloading(true)
        return updateProfile(auth.currentUser, userInfo)
    }

    const signIn = (email, password) => {
        setloading(true)
        return signInWithEmailAndPassword(auth, email, password)
    }

    const logOut = () => {
        return signOut(auth)
    }

    const LoginWithGoogle = () => {
        return signInWithPopup(auth, googleProvider)
    }


    //observer
    useEffect(() => {

        const unSubscribe = onAuthStateChanged(auth, currentUser => {
            setUser(currentUser)
            setloading(false)
        })

        return () => unSubscribe()
    }, [])
    const AuthInfo = {
        createUser,
        updateUser,
        signIn,
        user,
        logOut,
        loading,
        LoginWithGoogle,
    }
    return (
        <AuthContext.Provider value={AuthInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;