import { useState } from 'react'
import { Link, useHistory } from 'react-router-dom'

import { useAuth } from '../hooks/useAuth'

import { Button } from '../components/Button'

import { database } from '../services/firebase'

import illustrationImg from '../assets/image/illustration.svg'
import logoImg from '../assets/image/logo.svg'
import '../style/pages/createroom.scss'

export function NewRoom() {
    const [ newRoom, setNewRoom ] = useState('')

    const history = useHistory()

    const { user } = useAuth()

    async function handleCreateRoom(event) {
        event.preventDefault()
        
        if ( newRoom.trim() === '') return;

        const roomRef = database.ref('rooms')

        const firebaseRoom = await roomRef.push({
            title: newRoom,
            authorId: user?.id
        })

        history.push(`/admin/rooms/${firebaseRoom.key}`)
    }

    return (

        <div className="createroom">
            <aside className="createroom__hero">
                <img src={illustrationImg} alt=""/>
                <strong>Toda pergunta tem uma resposta.</strong>
                <p>Tire dúvida em tempo real.</p>
            </aside>
            <main className="createroom__main">
                <div className="createroom__main-container">
                    <img src={logoImg} alt="" />
                    <h2>Crie uma nova sala</h2>
                    <form onSubmit={handleCreateRoom}>
                        <input
                            type="text"
                            placeholder="Digite o nome da sala"
                            onChange={event => setNewRoom(event.target.value)}
                        />
                        <Button type="submit">
                            Criar sala
                        </Button>
                    </form>
                    <p>Quer entrar em uma sala já existe <Link to="/">Clique aqui</Link></p>
                </div>
            </main>
        </div>
    )
}