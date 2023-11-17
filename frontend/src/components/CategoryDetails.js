import { useCategoryContext } from '../hooks/useCategoryContext'
import { useAuthContext } from '../hooks/useAuthContext'
import { API_BASE_URL } from '../config/serverApiConfig'

// date fns
import formatDistanceFromNow from 'date-fns/formatDistanceToNow'

const CategoryDetails = ({ category }) => {
    const { dispatch } = useCategoryContext()
    const { user } = useAuthContext()

    const handleClick = async () => {
        if (!user || user.email != category.created_by_email) {
            // must be a signed in and category creator to delete a category
            return
        }

        const response = await fetch(API_BASE_URL + '/api/category/' + category._id, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })
        const json = await response.json()

        if (response.ok) {
            dispatch({type: 'DELETE_CATEGORY', payload: json})
        }
    }

    return (
        <div className="category-details">
            <h4>{category.title}</h4>
            <p><strong># of Cards: {category.card_count}</strong></p>
            <p>Created by: {category.created_by_email}</p>
            <p>Created {formatDistanceFromNow(new Date(category.createdAt), { addSuffix: true })}</p>
        </div>
    )
}

export default CategoryDetails