import { useCardContext } from "../hooks/useCardContext"
import { useAuthContext } from "../hooks/useAuthContext"
import { API_BASE_URL } from "../config/serverApiConfig"

const CardDetails = ({ card }) => {
    const { dispatch } = useCardContext()
    const { user } = useAuthContext()

    const handleClick = async () => {
        if (!user) {
            return
        }

        const response = await fetch(API_BASE_URL + '/api/card/' + card._id, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })
        const json = await response.json()

        if (response.ok) {
            dispatch({type: 'DELETE_CARD', payload: json})
        }
    }

    return (
        <div className='card-details'>
            <h4>{card.question}</h4>
            <span onClick={handleClick}>delete</span>
        </div>
    )
}

export default CardDetails