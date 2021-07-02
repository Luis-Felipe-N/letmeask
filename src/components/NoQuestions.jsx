import '../style/components/no-questions.scss'

import noQuestionImg from '../assets/image/empty-questions.svg'

export function NoQuestions() {
    return (
        <div className="no-questions">
            <div className="no-questions-content">
                <img src={ noQuestionImg } alt="Ilustração de balões de conversas"/>
                <h1>Nenhuma pergunta por aqui...</h1>
                <p>Envie o código desta sala para seus amigos e comece a responder!</p>
            </div>
        </div>
    )
}