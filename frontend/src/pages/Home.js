import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../config/serverApiConfig";
import { useCategoryContext } from "../hooks/useCategoryContext";
import { useCardContext } from "../hooks/useCardContext";
import { useAuthContext } from "../hooks/useAuthContext";

// components
import FormCheck from "react-bootstrap/FormCheck";
import CategoryDetails from "../components/CategoryDetails";
import CategoryForm from "../components/CategoryForm";

// possibly change to Categories
const Home = ({ categories }) => {
	// context
	const { user } = useAuthContext();
	const { dispatch } = useCategoryContext();
	const { dispatch: cardDispatch } = useCardContext();

	// state
	const [myCategories, setMyCategories] = useState(false);

	useEffect(() => {
		const fetchCatgories = async () => {
			const response = await fetch(API_BASE_URL + "/api/category");
			const json = await response.json();

			if (response.ok) {
				dispatch({ type: "SET_CATEGORIES", payload: json });
			}
		};

		cardDispatch({ type: "SET_CARDS", payload: null });

		fetchCatgories();
	}, [dispatch, cardDispatch]);

	const toggleMyCategories = () => {
		setMyCategories((prev) => !prev);
	};

	return (
		<div>
			<div style={{ display: "flex", justifyContent: "space-between" }}>
				<h2>Categories</h2>
				<FormCheck
					type="switch"
					label="My Categories"
					value={myCategories}
					checked={myCategories}
					onChange={toggleMyCategories}
				/>

				<button className="btn-outline">Test All Cards</button>
			</div>
			<div className="home">
				<div className="categories">
					{/* if myCategories NOT toggled (default) show all, 
					else only show users categories */}
					{!myCategories
						? categories &&
						  categories
								.filter(
									(category) =>
										!category.isPrivate ||
										(user &&
											category.created_by_email ===
												user.email)
								)
								.map((category) => (
									<Link
										to={`/category/${category.title}`}
										key={category._id}
										state={{
											category_id: `${category._id}`,
										}}
									>
										<CategoryDetails
											category={category}
											key={category._id}
										/>
									</Link>
								))
						: categories &&
						  categories
								.filter(
									(c) => c.created_by_email === user.email
								)
								.map((category) => (
									<Link
										to={`/category/${category.title}`}
										key={category._id}
										state={{
											category_id: `${category._id}`,
										}}
									>
										<CategoryDetails
											category={category}
											key={category._id}
										/>
									</Link>
								))}
				</div>
				<CategoryForm />
			</div>
		</div>
	);
};

export default Home;
