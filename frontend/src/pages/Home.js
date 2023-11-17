import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config/serverApiConfig";
import { useCategoryContext } from "../hooks/useCategoryContext";

// components
import CategoryDetails from "../components/CategoryDetails";
import CategoryForm from '../components/CategoryForm'

// possibly change to Categories
const Home = () => {
  const {categories, dispatch} = useCategoryContext()

  useEffect(() => {
    const fetchCatgories = async () => {
      const response = await fetch(API_BASE_URL + "/api/category");
      const json = await response.json();

      if (response.ok) {
        dispatch({type: 'SET_CATEGORIES', payload: json})
      }
    };

    fetchCatgories();
  }, []);

  return (
    <div>
        <h2>Categories</h2>
      <div className="home">
        <div className="categories">
          {categories &&
            categories.map((category) => (
              <CategoryDetails category={category} key={category._id} />
            ))}
        </div>
        <CategoryForm />
      </div>
    </div>
  );
};

export default Home;
