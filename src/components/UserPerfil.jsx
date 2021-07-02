import React from 'react'
import '../style/components/user-perfil.scss'

export function UserPerfil( { avatar, name } ) {
    return (
        <span className="user">
            <img className="user__avatar" src={ avatar } alt="Avatar do perfil" />
            <span className="user__name">{ name }</span>
        </span>
    )
}

