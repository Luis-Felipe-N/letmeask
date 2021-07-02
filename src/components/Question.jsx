import { UserPerfil } from "./UserPerfil"
import cx from 'classnames'

import '../style/components/question.scss'

export function Question( { content, author, children, isHighLighted = false , isAnswered = false }) {
    return (
        <div className={cx('questions',
            {'answered': isAnswered,
            'highlighted': isHighLighted}
            )}>
            <p>{ content }</p>
            <footer>
                <UserPerfil name={author.name} avatar={author.avatar} />
                <div>
                    {children}
                </div>
            </footer>
        </div>
    )
}