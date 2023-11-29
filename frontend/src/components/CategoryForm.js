import { useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { useCategoryContext } from '../hooks/useCategoryContext';
import { API_BASE_URL } from "../config/serverApiConfig";
import { useToken } from "../hooks/useToken"


const CategoryForm = () => {
  const { dispatch } = useCategoryContext()
  const { user } = useAuthContext();
  const { resetToken } = useToken()

  const [title, setTitle] = useState("");
// private
// multipleChoice
// color
  const [error, setError] = useState(null)
  const [emptyFields, setEmptyFields] = useState([])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!user) {
        setError('You must be logged in')
        return
    }

    const category = { title }

    const response = await fetch(API_BASE_URL + '/api/category', {
        method: 'POST',
        body: JSON.stringify(category),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`
        }
    })

    const json = await response.json()

    if (!response.ok) {
      if (response.status === 401) {
        resetToken()
        return
      }
        setError(json.error)
        setEmptyFields(json.emptyFields)
    }
    if (response.ok) {
        setTitle('')
        setError(null)
        setEmptyFields([])
        console.log('new category added', json)
        dispatch({type: 'CREATE_CATEGORY', payload: json})
    }
  };

  return (
  <form className="create" onSubmit={handleSubmit}>
    <h3> Add a New Category</h3>

    <label>Category Title:</label>
    <input 
        type='text'
        onChange={(e) => setTitle(e.target.value)}
        value={title}
        className={emptyFields.includes('title') ? 'error' : ''}
    />

    {/* private field */}

    {/* mulitpleChoice */}

    {/* color */}

    <button>Add Category</button>
    {error && <div className="error">{error}</div>}
  </form>
  )
};

export default CategoryForm;