import { createContext, useEffect, useState,  } from "react"
import { auth, firebase } from "../services/firebase"

export const AuthContext = createContext({})

export function AuthContextProvider(props) {
    const [ user, setUser] = useState()

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged( user => {
      if (user) {
        const { displayName, photoURL, uid} = user

        console.log('foi')

        if (!displayName || !photoURL) {
            throw new Error('Faltando informação!')
        }

        setUser({
          id: uid,
          name: displayName,
          avatar: photoURL
        })
      }
    })

    return () => {
      unsubscribe()
    }
  }, [])

    async function signInwithGoogle() {
        const provider = new firebase.auth.GoogleAuthProvider()

        const result = await  auth.signInWithPopup(provider)

        if (result.user) {
            const { displayName, photoURL, uid} = result.user

            console.log('foi')

            // if (!displayName || !photoURL) {
            //     throw new Error('Faltando informação!')
            // }

            setUser({
            id: uid,
            name: displayName,
            avatar: photoURL
            })
        }
    }

    return (
        <AuthContext.Provider value={{ user, signInwithGoogle }}>
          {props.children}
        </AuthContext.Provider>
    )
}