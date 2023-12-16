// date fns
import formatDistanceFromNow from 'date-fns/formatDistanceToNow'

const CategoryDetails = ({ category }) => {

    return (
        <div className="category-details" style={{boxShadow: `2px 2px 5px ${category.color}`}}>
            <div style={{color: `${category.color}`}}>
                <h4>{category.title}</h4>
            </div>
            <p><strong># of Cards: {category.card_count}</strong></p>
            <p>Created by: {category.created_by_email}</p>
            <p>{formatDistanceFromNow(new Date(category.createdAt), { addSuffix: true })}</p>
        </div>
    )
}

export default CategoryDetails