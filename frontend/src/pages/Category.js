import { useParams, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { API_BASE_URL } from "../config/serverApiConfig";
import { useCardContext } from "../hooks/useCardContext";

// components
import CardDetails from "../components/CardDetails";
import CardForm from "../components/CardForm";

const Category = () => {
  const { title } = useParams();
  const { cards, dispatch } = useCardContext();

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

    fetchCards();

    // calls when mounted on StrictMode
    return () => {
      dispatch({ type: 'SET_CARDS', payload: null })
    }
  }, [category_id, dispatch]);

  // DELETE CATEGORY
  // if (!user || user.email != category.created_by_email) {
  //     // must be a signed in and category creator to delete a category
  //     return
  // }

  // const response = await fetch(API_BASE_URL + '/api/category/' + category._id, {
  //     method: 'DELETE',
  //     headers: {
  //         'Authorization': `Bearer ${user.token}`
  //     }
  // })
  // const json = await response.json()

  // if (response.ok) {
  //     dispatch({type: 'DELETE_CATEGORY', payload: json})
  // }

  return (
    <div>
      <h2>{title} Flash Cards</h2>
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
