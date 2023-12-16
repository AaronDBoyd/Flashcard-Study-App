import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config/serverApiConfig";
import { useCategoryContext } from "../hooks/useCategoryContext";
import { useCardContext } from "../hooks/useCardContext";
import { useAuthContext } from "../hooks/useAuthContext";

// components
import FormCheck from "react-bootstrap/FormCheck";
import CategoryForm from "../components/CategoryForm";
import PaginatedCategories from "../components/PaginatedCategories";
import { IconButton, Tooltip } from "@mui/material";
import { AddCircle } from "@mui/icons-material";

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
	const [addNew, setAddNew] = useState(false);

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
			<div className="home-header">
				<div style={{}}>
					<h2>Categories</h2>

					{user && (
						<FormCheck
							type="switch"
							label="My Categories"
							value={myCategories}
							checked={myCategories}
							onChange={toggleMyCategories}
						/>
					)}
				</div>

				<IconButton
					className="new-cat-button"
					onClick={() => setAddNew(true)}
				>
					<Tooltip
						title={
							user ? (
								<h6>CREATE CATEGORY</h6>
							) : (
								<h6>LOGIN TO CREATE CATEGORY</h6>
							)
						}
						placement="top"
					>
						<AddCircle
							sx={{
								width: 60,
								height: 60,
								marginTop: "-80px",
								color: "#841e62",
							}}
						/>
					</Tooltip>
				</IconButton>

				<div>
					<input
						placeholder="search"
						value={searchInput}
						onChange={handleSearch}
					/>
				</div>

				{/* <button className="btn-outline" onClick={handleTestAll}>
					Test All Cards
				</button> */}
			</div>
			<div className="home">
				<PaginatedCategories filteredCategories={filteredCategories} />
				{user && addNew && (
					<CategoryForm addNew={addNew} setAddNew={setAddNew} />
				)}
			</div>
		</div>
	);
};

export default Home;
