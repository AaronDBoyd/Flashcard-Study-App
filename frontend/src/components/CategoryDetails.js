
// date fns
import formatDistanceFromNow from 'date-fns/formatDistanceToNow'

const CategoryDetails = ({ category }) => {

    return (
        <div className="category-details">
            <h4>{category.title}</h4>
            <p><strong># of Cards:</strong></p>
            <p>Created by: {category.created_by_email}</p>
            <p>Created {formatDistanceFromNow(new Date(category.createdAt), { addSuffix: true })}</p>
        </div>
    )
}

export default CategoryDetails