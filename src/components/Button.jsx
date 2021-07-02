import '../style/components/button.scss'

export function Button( { isOutline = false, ...props }) {
    return (
        <button 
        className={`button ${ isOutline && 'outline' }`} 
        {...props} 
        />
    )
}