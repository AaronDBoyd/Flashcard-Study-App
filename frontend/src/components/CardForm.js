import { useState } from 'react'
import { useAuthContext } from '../hooks/useAuthContext'
import { API_BASE_URL } from '../config/serverApiConfig'

const CardForm = ({category_id}) => {
    const { user } = useAuthContext()
    
    const [question, setQuestion] = useState('')
    const [answer, setAnswer] = useState('')
    //const [mulitpleChoice, setMultipleChoice] = useState(false)
    //const [tags, setTags] = useState([])
    const [error, setError] = useState(null)
    const [emptyFields, setEmptyFields] = useState([])


    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!user) {
            setError('You must be logged in')
            return
        }

        const card = {question, answer, category_id}

        const response = await fetch(API_BASE_URL + '/api/card', {
            method: 'POST',
            body: JSON.stringify(card),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            }
        })

        const json = await response.json()

        if (!response.ok) {
            setError(json.error)
            setEmptyFields(json.emptyFields)
        }
        if (response.ok) {
            setQuestion('')
            setAnswer('')
            setError(null)
            setEmptyFields([])
            console.log('new card added', json)
            // dispatch({type: 'CREATE_CARD', payload: json})
        }
    }

    return (
        <form className='create' onSubmit={handleSubmit}>
            <label>Question:</label>
            <input 
                type='text'
                onChange={(e) => setQuestion(e.target.value)}
                value={question}
                className={emptyFields.includes('question') ? 'error' : ''}
            />

            <label>Answer:</label>
            <input 
                type='text'
                onChange={(e) => setAnswer(e.target.value)}
                value={answer}
                className={emptyFields.includes('answer') ? 'error' : ''}
            />

            <button>Add Card</button>
            {error && <div className='error'>{error}</div>}
        </form>
    )
}

export default CardForm