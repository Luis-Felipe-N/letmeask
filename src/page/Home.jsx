import { useState } from 'react'

import { useHistory } from 'react-router-dom'

import { useAuth } from '../hooks/useAuth'
import { Button } from '../components/Button'

import illustrationImg from '../assets/image/illustration.svg'
import logoImg from '../assets/image/logo.svg'
import googleImg from '../assets/image/google-icon.svg'
import '../style/pages/createroom.scss'
import { database } from '../services/firebase'

export function Home() {
    const [ codeRoom, setCodeRoom ] = useState('')
    const history =  useHistory()
    const { user, signInwithGoogle } = useAuth()

    async function handleCreateRoom() {
        if (!user) {
            console.log('usuario não estava cadastrado')
            await signInwithGoogle()
        }
    
        history.push('rooms/new')
    }

    async function handleJoinRoom( event ) {
        event.preventDefault()
        if ( codeRoom.trim() === '' ) return

        const roomRef = await database.ref(`rooms/${codeRoom}`).get()

        if ( !roomRef.exists() ) {
            throw Error('Sala inexistente!')
        }

        if ( roomRef.val().closedAt ) {
            alert('Sala inexistente!')
            return
        }

        history.push(`/rooms/${codeRoom}`)
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
