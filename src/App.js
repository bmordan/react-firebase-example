import React, { useEffect, useState } from 'react'
import './firebase'
import { getAuth, signInWithPopup, GithubAuthProvider, signOut } from 'firebase/auth'
import { Notes } from './Notes'

export default function App () {
    const [user, setUser] = useState(null)

    useEffect(() => {
        const github = new GithubAuthProvider()
        const auth = getAuth()
        signInWithPopup(auth, github)
            .then(githubUser => {
                const { displayName, uid } = githubUser.user
                setUser({ displayName, uid })
            })
    }, [])

    const signOutUser = () => {
        const auth = getAuth()
        signOut(auth).then(() => setUser(null))
    }

    if (!user) {
        return (
            <section>Make sure to allow pop ups - Sign in with GitHub</section>
        )
    } else {
        return (
            <section>
                <h1>{user.displayName}'s Notes</h1>
                <button onClick={signOutUser}>Sign Out</button>
                <Notes user={user}/>
            </section>
        )
    }
}