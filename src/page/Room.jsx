import React, { useEffect, useState } from 'react'

import { useParams, Link, useHistory } from 'react-router-dom'
import { toast } from 'react-toastify'

import { Button } from '../components/Button'
import { RoomCode } from '../components/RoomCode'
import { UserPerfil } from '../components/UserPerfil'
import { Question } from '../components/Question'

// css
import '../style/pages/room.scss'
import 'react-toastify/dist/ReactToastify.css';

import logoImg from '../assets/image/logo.svg'
import { useAuth } from '../hooks/useAuth'
import { useRoom } from '../hooks/useRoom'
import { database } from '../services/firebase'
import { NoQuestions } from '../components/NoQuestions'

export function Room() {
    const params = useParams()
    const roomId = params.id

    const { user, signInwithGoogle } = useAuth()
    const [ newQuestion, setNewQuestion ] = useState('')
    const { questions, title } = useRoom( roomId )
    const history= useHistory()


    useEffect( async () => {

        const roomRef = await database.ref(`rooms/${ roomId }`)

        roomRef.on('value', ( snapshot ) => {
            if( snapshot.val().closedAt ) {
                history.push('/')
                toast.warn('Sala excluida pelo administrador!', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                    progress: undefined,
                });
            }
          })
    }, [ roomId ])


    async function handleSendQuestion( event ) {
        event.preventDefault()

        if ( newQuestion.trim() === '' ) return

        if ( !user ) throw Error( 'You must be logged! / Você precisa estar logado!')

        const question = {
            content: newQuestion,
            author: {
                name: user.name,
                avatar: user.avatar
            },
            isHighLighted: false,
            isAnswered: false
        }

        await (await database.ref(`rooms/${roomId}/questions`).push(question)).endBefore

        setNewQuestion('')
    }


    async function handleLogin() {
        await signInwithGoogle()
    }


    async function handleLikeQuestion( questionId, likeId ) {

        if ( likeId ) {
            await database.ref(`/rooms/${roomId}/questions/${questionId}/likes/${likeId}`).remove()
            console.log( likeId )
        } else {
            await database.ref(`/rooms/${roomId}/questions/${questionId}/likes`).push({
                authorId: user.id
            })
        }

    }

    
    return (
        <div className="room">
            <header className="room__header">
                <div className="content">
                    <Link to="/"><img className="room__header-logo" src={logoImg} alt="Imagem da logo" /></Link>
                    
                    <RoomCode code={roomId} />
                </div>
            </header>

            <main className="room__main">
                <div className="room-title">
                    <h1>{title}</h1>
                    { questions.length > 0 && <span>{questions.length} perguntas</span>}
                </div>
                
                <form onSubmit={ handleSendQuestion }>
                    <textarea 
                        placeholder="O que você quer perguntar?"
                        onChange={ event => setNewQuestion(event.target.value)}
                        value={newQuestion}
                    />

                    <div className="form-footer">
                        { user ? <UserPerfil avatar={ user.avatar } name={ user.name }/>
                            : <span className="form-login">Para fazer uma pegunta, <button onClick={handleLogin}>faça seu login</button></span> }
                        <Button type="submit" disabled={ !user }>Enviar pergunta</Button>
                        
                    </div>
                </form>

                <section className="container-questions">
                {
                    questions.length > 0 ? 
                    questions.reverse().map( ({ id, author, content, likeId, likeCount, isHighLighted, isAnswered }) => 
                    <Question
                        key={id}
                        author={author} 
                        content={content}
                        isHighLighted={ isHighLighted }
                        isAnswered={ isAnswered }
                    >
                        <button 
                            onClick= {(event) => handleLikeQuestion( id, likeId, event )}
                            className={`like-btn ${ likeId && 'liked'}`}
                            type="button"
                            aria-label="Marca como gostei"
                            disabled={isAnswered}
                            >
                            { likeId && <span>{ likeCount }</span>}
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7 22H4C3.46957 22 2.96086 21.7893 2.58579 21.4142C2.21071 21.0391 2 20.5304 2 20V13C2 12.4696 2.21071 11.9609 2.58579 11.5858C2.96086 11.2107 3.46957 11 4 11H7M14 9V5C14 4.20435 13.6839 3.44129 13.1213 2.87868C12.5587 2.31607 11.7956 2 11 2L7 11V22H18.28C18.7623 22.0055 19.2304 21.8364 19.5979 21.524C19.9654 21.2116 20.2077 20.7769 20.28 20.3L21.66 11.3C21.7035 11.0134 21.6842 10.7207 21.6033 10.4423C21.5225 10.1638 21.3821 9.90629 21.1919 9.68751C21.0016 9.46873 20.7661 9.29393 20.5016 9.17522C20.2371 9.0565 19.9499 8.99672 19.66 9H14Z" stroke="#737380" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>

                        </button>
                    </Question>
                        )
                    : 
                    <NoQuestions />
                }
                </section>
            </main>
        </div>
    )
}

