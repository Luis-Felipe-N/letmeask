import { Link, useHistory, useParams } from "react-router-dom"
import { toast } from 'react-toastify'

import { Button } from "../components/Button"
import { RoomCode } from "../components/RoomCode"
import { Question } from "../components/Question"
import { NoQuestions } from "../components/NoQuestions"

import { useRoom } from '../hooks/useRoom'

import { database } from '../services/firebase'

import '../style/pages/room.scss'
import 'react-toastify/dist/ReactToastify.css';

import logoImg from '../assets/image/logo.svg'



export function AdminRoom() {
    const params = useParams()
    const roomId = params.id
    const history = useHistory()

    const { questions, title } = useRoom( roomId )

    async function handleRemoveRoom( ) {

        const closeRoom = window.confirm("Dejesa excluir essa sala?")

        if ( closeRoom ) {
            await database.ref(`rooms/${roomId}`).update({
                closedAt: new Date()
            })
            history.push('/')
            toast.success('Sala excluida com sucesso!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                });
        }
    }

    async function handleRemoveQuestions( questionId ) {
        const canRemoveQuestion = window.confirm("Dejesa excluir essa pergunta?")
        if ( canRemoveQuestion ) {
            await database.ref(`rooms/${ roomId }/questions/${ questionId }`).remove()
            toast.success('Pergunta excluida com sucesso!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                });
        }
    }

    async function handleHighLighted( questionId, isHighLighted ) {
        if ( isHighLighted ) {
            await database.ref(`rooms/${ roomId }/questions/${ questionId }`).update({
                isHighLighted: false
            })
        } else {
            await database.ref(`rooms/${ roomId }/questions/${ questionId }`).update({
                isHighLighted: true
            })
        }
    }

    async function handleAnswered( questionId ) {
            await database.ref(`rooms/${ roomId }/questions/${ questionId }`).update({
                isAnswered: true,
                isHighLighted: false
            })        
    }


    return (
        <div className="room">
        <header className="room__header">
            <div className="content">
                <Link to="/"><img className="room__header-logo" src={logoImg} alt="Imagem da logo" /></Link>
                
                <div className="room__header-btns">
                    <RoomCode code={roomId} />

                    <Button onClick={ handleRemoveRoom } isOutline >Encerrar sala</Button>
                </div>
            </div>
        </header>

        <main className="room__main">
            <div className="room-title">
                <h1>{title}</h1>
                { questions.length > 0 && <span>{questions.length} perguntas</span>}
            </div>

            <section className="container-questions">
            {
                questions.length > 0 ? 
                questions.reverse().map( ( { id, content, author, isHighLighted, isAnswered } ) => 
                <Question
                    key={id}
                    author={author} 
                    content={content}
                    isHighLighted={ isHighLighted }
                    isAnswered={ isAnswered }
                >
                    {
                        !isAnswered && (
                            <>
                                 <button 
                                    className="admin__question-btn"
                                    type="submit"
                                    aria-label="Marcar como respondida"
                                    onClick={ () => handleAnswered( id, isAnswered ) }
                                    >
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="12.0003" cy="11.9998" r="9.00375" stroke="#737380" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                        <path d="M8.44287 12.3391L10.6108 14.507L10.5968 14.493L15.4878 9.60193" stroke="#737380" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                </button>
                                <button 
                                    className="admin__question-btn"
                                    type="submit"
                                    aria-label="Indica que est?? sendo respondida"
                                    onClick={ () => handleHighLighted( id, isHighLighted ) }
                                    >
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M12 17.9999H18C19.657 17.9999 21 16.6569 21 14.9999V6.99988C21 5.34288 19.657 3.99988 18 3.99988H6C4.343 3.99988 3 5.34288 3 6.99988V14.9999C3 16.6569 4.343 17.9999 6 17.9999H7.5V20.9999L12 17.9999Z" stroke="#737380" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                </button>
                            </>
                        )
                    }
                    <button 
                        className="delete-btn"
                        type="submit"
                        aria-label="Deletar mensagem"
                        onClick={ () =>  handleRemoveQuestions( id ) }
                        >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 5.99988H5H21" stroke="#737380" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M8 5.99988V3.99988C8 3.46944 8.21071 2.96074 8.58579 2.58566C8.96086 2.21059 9.46957 1.99988 10 1.99988H14C14.5304 1.99988 15.0391 2.21059 15.4142 2.58566C15.7893 2.96074 16 3.46944 16 3.99988V5.99988M19 5.99988V19.9999C19 20.5303 18.7893 21.039 18.4142 21.4141C18.0391 21.7892 17.5304 21.9999 17 21.9999H7C6.46957 21.9999 5.96086 21.7892 5.58579 21.4141C5.21071 21.039 5 20.5303 5 19.9999V5.99988H19Z" stroke="#737380" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
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