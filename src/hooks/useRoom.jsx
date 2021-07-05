import { useEffect, useState } from "react"
import { database } from "../services/firebase"
import { useAuth } from "./useAuth"

export function useRoom( roomId ) {
    const { user } = useAuth()
    const [ questions, setQuestions ] = useState([])
    const [ title, setTitle ] = useState('')

    useEffect(() => {
        
        const roomRef = database.ref(`rooms/${roomId}`)

        roomRef.on( 'value', room => {
            const paserdQuestion = Object.entries( room.val().questions || {} )
                .map( ( [ key, { content, author, isHighLighted, isAnswered, likes } ]) => {
                    return {
                        id: key,
                        content,
                        author,
                        isHighLighted,
                        isAnswered,
                        likeCount: Object.values(likes ?? {}).length,
                        likeId: Object.entries(likes ?? {}).find( ([key, like]) => like.authorId === user?.id )?.[0]
                    }
                })
            setQuestions( paserdQuestion )
            setTitle(room.val().title)
        })

        return () => {
            roomRef.off('value')
        }

    }, [ roomId, user?.id ])

    return { questions, title }

}