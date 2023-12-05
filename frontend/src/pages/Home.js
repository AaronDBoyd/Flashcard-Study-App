import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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

	const navigate = useNavigate();

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

	const handleTestAll = async () => {
		const fetchAllCards = async () => {
			const response = await fetch(API_BASE_URL + "/api/card/");
			const json = await response.json();

			if (response.ok) {
				const publicCategoryIds = [];
				categories
					.filter(
						(c) =>
							!c.isPrivate ||
							(user && c.created_by_email === user.email)
					)
					.map((c) => publicCategoryIds.push(c._id));

				// remove cards from categories that are private
				const publicCards = json.filter((c) =>
					publicCategoryIds.includes(c.category_id)
				);
				cardDispatch({ type: "SET_CARDS", payload: publicCards });
				navigate("/test/all");
			}
		};

		await fetchAllCards();		
	};

	return (
		<div>
			<div style={{ display: "flex", justifyContent: "space-between" }}>
				<h2>Categories</h2>
				{ user && <FormCheck
					type="switch"
					label="My Categories"
					value={myCategories}
					checked={myCategories}
					onChange={toggleMyCategories}
				/> }

				<button className="btn-outline" onClick={handleTestAll}>
					Test All Cards
				</button>
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
