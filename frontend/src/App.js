import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthContext } from "./hooks/useAuthContext";

// pages & components
import Navbar from "./components/Navbar";
import Category from "./pages/Category";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Test from "./pages/Test";
import { useCategoryContext } from "./hooks/useCategoryContext";
import { useState } from "react";

function App() {
  const { user } = useAuthContext();
  const { categories } = useCategoryContext();
  const [ filteredCategories, setFilteredCategories ] = useState(categories)

  const handleSearch = (e) => {
    // convert input to lower case
    const lowerCase = e.target.value.toLowerCase()
    // if no input, return all categories
    const filteredData = categories.filter((category => {
      if (lowerCase === '') {
        return category
      }
      // return categories that contain the input sub string
      else {
        return category.title.toLowerCase().includes(lowerCase)
      }     
    }))
    
    setFilteredCategories(filteredData)
  }

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar handleSearch={handleSearch} />
        <div className="pages">
          <Routes>
            <Route path="/" element={<Home categories={filteredCategories} />} />
            <Route path="/category/:title" element={<Category />} />
            <Route
              path="/login"
              element={!user ? <Login /> : <Navigate to="/" />}
            />
            <Route path='/signup' element={!user ? <Signup /> : <Navigate to='/' />} /> 
            <Route path='/test/:category' element={<Test />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
