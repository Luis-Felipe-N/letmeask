import copyImg  from '../assets/image/copy.svg'

import '../style/components/room-code.scss'

export function RoomCode({code}) {
    
    function copyRoomCode() {
        navigator.clipboard.writeText(code)
    }

    return (
        <button onClick={copyRoomCode} className="room-code">
            <div><img src={copyImg} alt="" /></div>
            <span>{code}</span>
        </button>
    )
}