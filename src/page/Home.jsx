import { useState } from 'react'

import { useHistory } from 'react-router-dom'
import { toast, toastify } from 'react-toastify'

import { useAuth } from '../hooks/useAuth'
import { Button } from '../components/Button'

import illustrationImg from '../assets/image/illustration.svg'
import logoImg from '../assets/image/logo.svg'
import googleImg from '../assets/image/google-icon.svg'
import '../style/pages/createroom.scss'
import 'react-toastify/dist/ReactToastify.css';

import { database } from '../services/firebase'

export function Home() {
    const [ codeRoom, setCodeRoom ] = useState('')
    const history =  useHistory()
    const { user, signInwithGoogle } = useAuth()
    toast.configure()

    async function handleCreateRoom() {
        if (!user) {
            toast.error('Usuário não cadastrado', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                });
            await signInwithGoogle()
        }
    
        history.push('rooms/new')
    }

    async function handleJoinRoom( event ) {
        event.preventDefault()
        if ( codeRoom.trim() === '' ) return

        const roomRef = await database.ref(`rooms/${codeRoom}`).get()

        if ( !roomRef.exists() ) {
            toast.error('Essa sala não existe!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                });
        }

        if ( roomRef.val().closedAt ) {
            toast.error(handleFormatMinutes( roomRef.val().closedAt ), {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                });
            return
        }

        history.push(`/rooms/${codeRoom}`)
    }

    function handleFormatMinutes( exclusionTime ) {
        const minutos = new Date( new Date() - Date.parse( exclusionTime ) ).getMinutes()
        return minutos ? `Essa sala foi execluida a ${ minutos } minutos atrás!` : 'Essa sala acabou de ser excluida!'
    }

    return (
        <div className="createroom">
            <aside className="createroom__hero">
                <img className="createroom__hero-img" src={illustrationImg} alt=""/>
                <strong className="createroom__hero-text-strong">Toda pergunta tem uma resposta.</strong>
                <p className="createroom__hero-text">Tire dúvida em tempo real.</p>
            </aside>
            <main className="createroom__main">
                <div className="createroom__main-container">
                    <img src={logoImg} alt="" />
                    <button onClick={handleCreateRoom} className="btn-google">
                        <img src={googleImg} alt="Logo google" />
                        Crie sua sala com o Goolge
                    </button>
                    <div className="divider"> ou entre em uma sala</div>
                    <form onSubmit={ handleJoinRoom }>
                        <input
                            type="text"
                            placeholder="Digite o código da sala"
                            onChange={ event => setCodeRoom( event.target.value )}
                        />
                        <Button  type="submit">
                            Entrar na sala
                        </Button>
                    </form>
                </div>
            </main>
        </div>
    )
}
