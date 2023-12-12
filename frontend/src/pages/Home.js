import { useCallback, useEffect, useState } from "react";
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
const Home = () => {
	// context
	const { user } = useAuthContext();
	const { categories, dispatch: categoryDispatch } = useCategoryContext();
	const { dispatch: cardDispatch } = useCardContext();

	// state
	const [myCategories, setMyCategories] = useState(false);
	const [currentCategories, setCurrentCategories] = useState(null); // All or MY categories
	const [filteredCategories, setFilteredCategories] = useState(null); // filter with Search
	const [searchInput, setSearchInput] = useState("");

	const navigate = useNavigate();

	const assignCategories = useCallback(
		(showMine) => {
			const catArray = showMine
				? categories.filter((c) => c.created_by_email === user.email)
				: categories.filter(
						(category) =>
							!category.isPrivate ||
							(user && category.created_by_email === user.email)
				  );

			setCurrentCategories(catArray);
			setFilteredCategories(catArray);
		},
		[categories, user]
	);

	useEffect(() => {
		if (categories) {
			assignCategories(myCategories);
		}
	}, [categories, myCategories, assignCategories]);

	useEffect(() => {
		const fetchCatgories = async () => {
			const response = await fetch(API_BASE_URL + "/api/category");
			const json = await response.json();

			if (response.ok) {
				categoryDispatch({ type: "SET_CATEGORIES", payload: json });
			}
		};

		cardDispatch({ type: "SET_CARDS", payload: null });

		fetchCatgories();
	}, [categoryDispatch, cardDispatch]);

	const toggleMyCategories = () => {
		setMyCategories((prev) => !prev);
		setSearchInput("");
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

				if (publicCards.length > 0) {
					cardDispatch({ type: "SET_CARDS", payload: publicCards });
					navigate("/test/all");
				}
				// else {
				// 	show message to create cards before testing
				// }
			}
		};

		await fetchAllCards();
	};

	const handleSearch = (e) => {
		setSearchInput(e.target.value);
		const lowerCase = e.target.value.toLowerCase();

		// if no input, return all categories
		const filteredData = currentCategories.filter((category) => {
			if (lowerCase === "") {
				return category;
			}
			// return categories that contain the input sub string
			else {
				return category.title.toLowerCase().includes(lowerCase);
			}
		});

		setFilteredCategories(filteredData);
	};

	return (
		<div>
			<div style={{ display: "flex", justifyContent: "space-between" }}>
				<h2>Categories</h2>
				<div>
					<input
						placeholder="search"
						value={searchInput}
						onChange={handleSearch}
					/>
				</div>
				{user && (
					<FormCheck
						type="switch"
						label="My Categories"
						value={myCategories}
						checked={myCategories}
						onChange={toggleMyCategories}
					/>
				)}

				<button className="btn-outline" onClick={handleTestAll}>
					Test All Cards
				</button>
			</div>
			<div className="home">
				<div className="categories">
					{/* if myCategories NOT toggled (default) show all, 
					else only show users categories */}
					{filteredCategories &&
						filteredCategories.map((category) => (
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
