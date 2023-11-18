import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config/serverApiConfig";
import { useCardContext } from "../hooks/useCardContext";
import { useAuthContext } from "../hooks/useAuthContext";
import { useCategoryContext } from "../hooks/useCategoryContext";

// components
import CardDetails from "../components/CardDetails";
import CardForm from "../components/CardForm";

const Category = () => {
  const { title } = useParams();
  const { cards, dispatch } = useCardContext();
  const { user } = useAuthContext()
  const { dispatch: categoryDispatch } = useCategoryContext()
  const [category, setCategory] = useState(null)
  const [notice, setNotice] = useState('')

  const navigate= useNavigate()

  // pull category_id from Link prop
  const location = useLocation();
  const { category_id } = location.state;

  useEffect(() => {
    const fetchCards = async () => {
      const response = await fetch(
        API_BASE_URL + "/api/card/category/" + category_id
      );
      const json = await response.json();

      if (response.ok) {
        dispatch({ type: "SET_CARDS", payload: json });
      }
    };

    const fetchCategory = async () => {
      const response = await fetch(
        API_BASE_URL + '/api/category/' + category_id
      );
      const json = await response.json();

      if (response.ok) {
        setCategory(c => json)
      }
    };

    fetchCards();
    fetchCategory();

    // calls when mounted on StrictMode
    return () => {
      dispatch({ type: 'SET_CARDS', payload: null })
    }
  }, [category_id, dispatch]);

  // DELETE CATEGORY
  const handleDelete = async () => {

    if (!user || user.email !== category.created_by_email) {
      setNotice('Must besigned in and category creator to delete a category') 
      return
    }
    
    const response = await fetch(API_BASE_URL + '/api/category/' + category_id, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${user.token}`
      }
    })
    //const json = await response.json()
    
    if (response.ok) {
      await categoryDispatch({type: 'SET_CATEGORIES', payload: null})
      navigate('/')
    }
  }
    
  return (
    <div>
      <h2>{title} Flash Cards</h2>
      <span onClick={handleDelete}>Delete Category </span>
      {notice && <span className='error'>{notice}</span>}
      <div className="cards">
        <div>
          {cards &&
            cards.map((card) => <CardDetails key={card._id} card={card} />)}
        </div>
        <CardForm category_id={category_id} />
      </div>
    </div>
  );
};

export default Category;
