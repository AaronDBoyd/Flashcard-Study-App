import { useEffect } from "react";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../config/serverApiConfig";
import { useCategoryContext } from "../hooks/useCategoryContext";
import { useCardContext } from "../hooks/useCardContext";
import { useAuthContext } from "../hooks/useAuthContext";

// components
import CategoryDetails from "../components/CategoryDetails";
import CategoryForm from "../components/CategoryForm";

// possibly change to Categories
const Home = () => {
	const { user } = useAuthContext();
	const { categories, dispatch } = useCategoryContext();
	const { dispatch: cardDispatch } = useCardContext();

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
	}, [dispatch]);

	return (
		<div>
			<h2>Categories</h2>
			<div className="home">
				<div className="categories">
					{categories &&
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
									state={{ category_id: `${category._id}` }}
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
