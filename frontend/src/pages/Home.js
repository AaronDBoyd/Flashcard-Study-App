import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config/serverApiConfig";

// components
import CategoryDetails from "../components/CategoryDetails";

// possibly change to Categories
const Home = () => {
  const [categories, setCategories] = useState(null);

  useEffect(() => {
    const fetchCatgories = async () => {
      const response = await fetch(API_BASE_URL + "/api/category");
      const json = await response.json();

      if (response.ok) {
        setCategories(json);
      }
    };

    fetchCatgories();
  }, []);

  return (
    <div>
        <h2>Categories</h2>
      <div className="home">
        {/* <h2>Categories</h2> */}
        <div className="categories">
          {categories &&
            categories.map((category) => (
              <CategoryDetails category={category} key={category._id} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default Home;