import { useEffect } from "react";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../config/serverApiConfig";
import { useCategoryContext } from "../hooks/useCategoryContext";

// components
import CategoryDetails from "../components/CategoryDetails";
import CategoryForm from "../components/CategoryForm";

// possibly change to Categories
const Home = () => {
  const { categories, dispatch } = useCategoryContext();

  useEffect(() => {
    const fetchCatgories = async () => {
      const response = await fetch(API_BASE_URL + "/api/category");
      const json = await response.json();

      if (response.ok) {
        dispatch({ type: "SET_CATEGORIES", payload: json });
      }
    };

    fetchCatgories();
  }, [dispatch]);

  return (
    <div>
      <h2>Categories</h2>
      <div className="home">
        <div className="categories">
          {categories &&
            categories.map((category) => (
              <Link to={`/category/${category.title}`} key={category._id} state={{ category_id: `${category._id}`}}>
                <CategoryDetails category={category} key={category._id} />
              </Link> 
            ))}
        </div>
        <CategoryForm />
      </div>
    </div>
  );
};

export default Home;
