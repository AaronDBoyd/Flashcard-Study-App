import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthContext } from "./hooks/useAuthContext";

// pages & components
import Navbar from "./components/Navbar";
import Category from "./pages/Category";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Test from "./pages/Test";

function App() {
	const { user } = useAuthContext();

	return (
		<div className="App">
			<BrowserRouter>
				<Navbar />
				<div className="pages">
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/category/:title" element={<Category />} />
						<Route
							path="/login"
							element={!user ? <Login /> : <Navigate to="/" />}
						/>
						<Route
							path="/signup"
							element={!user ? <Signup /> : <Navigate to="/" />}
						/>
						<Route path="/test/:category" element={<Test />} />
					</Routes>
				</div>
			</BrowserRouter>
		</div>
	);
}

export default App;
