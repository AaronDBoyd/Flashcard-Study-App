import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config/serverApiConfig";
import { useCardContext } from "../hooks/useCardContext";
import { useAuthContext } from "../hooks/useAuthContext";
import { useCategoryContext } from "../hooks/useCategoryContext";

// components
import CategoryEditForm from "../components/CategoryEditForm";
import CardForm from "../components/CardForm";
import DeleteModal from "../components/DeleteModal";
import PaginatedCards from "../components/PaginatedCards";
import TestCategoryDropdown from "../components/TestCategoryDropdown";
import { IconButton, Tooltip } from "@mui/material";
import { AddCircle } from "@mui/icons-material";

const Category = () => {
	// grab category from title instead of category_id in order to navigate back to category from test
	//const { title } = useParams();
	// context
	const { user } = useAuthContext();
	const { cards, dispatch: cardDispatch } = useCardContext();
	const { categories, dispatch: categoryDispatch } = useCategoryContext();

	// state
	const [category, setCategory] = useState(null);
	const [confirm, setConfirm] = useState(false);
	const [color, setColor] = useState("");
	const [editCategory, setEditCategory] = useState(false);
	const [passedCardCount, setPassedCardCount] = useState(0);
	const [addNew, setAddNew] = useState(false);

	const navigate = useNavigate();

	// pull category_id from Link prop
	const location = useLocation();
	const { category_id } = location.state;

	// GET cards & category
	useEffect(() => {
		const fetchCategory = async () => {
			const response = await fetch(
				API_BASE_URL + "/api/category/" + category_id
			);
			const json = await response.json();

			if (response.ok) {
				setCategory(json);
				setColor(json.color);
			}
		};
		const fetchCards = async () => {
			const response = await fetch(
				API_BASE_URL + "/api/card/category/" + category_id
			);
			const json = await response.json();

			if (response.ok) {
				cardDispatch({ type: "SET_CARDS", payload: json });
			}
		};

		// setCategory(categories.filter(c => c.title === title)[0])
		// setColor(category.color)
		fetchCategory();
		fetchCards();
	}, [category_id, cardDispatch]);

	useEffect(() => {
		if (cards && user) {
			const passed = cards.filter((c) =>
				user.passedCardIds.includes(c._id)
			);

			setPassedCardCount(passed.length);
		}
	}, [cards, user]);

	const handleConfirmDelete = async () => {
		const response = await fetch(
			API_BASE_URL + "/api/category/" + category_id,
			{
				method: "DELETE",
				headers: {
					Authorization: `Bearer ${user.token}`,
				},
			}
		);

		if (response.ok) {
			// reduce existing cards in this category to _ids array
			const cardIds = cards.map((c) => c._id);
			// remove cards from user's passedCardIds array
			user.passedCardIds = user.passedCardIds.filter(
				(c) => !cardIds.includes(c)
			);
			// save the user to local storage
			localStorage.setItem("user", JSON.stringify(user));

			await categoryDispatch({ type: "SET_CATEGORIES", payload: null });
			navigate("/");
		}
	};

	return (
		<div style={{ color: "whitesmoke" }}>
			<div style={{ display: "flex", justifyContent: "space-around", height: '100px' }}>
				<h2>
					{category && (
						<span style={{ color: `${category.color}` }}>
							{category.title}
						</span>
					)}{" "}
					Flash Cards
				</h2>
				<IconButton
					className="new-cat-button"
					onClick={() => setAddNew(true)}
				>
					<Tooltip
						title={
							user ? (
								<h6>CREATE CARD</h6>
							) : (
								<h6>LOGIN TO CREATE CARD</h6>
							)
						}
						placement="top"
					>
						<AddCircle
							sx={{
								width: 60,
								height: 60,
								marginTop: "-40px",
								marginRight: '40px',
								color: "#841e62",
							}}
						/>
					</Tooltip>
				</IconButton>
				{cards && (
					<h2>
						Passed: {passedCardCount} of {cards.length}
					</h2>
				)}
			</div>

			<div style={{ display: 'flex', justifyContent: 'center'}}>
				{user &&
					category &&
					user.email === category.created_by_email && (
						<button
							className="delete-button"
							onClick={() => setConfirm(true)}
						>
							Delete Category{" "}
						</button>
					)}

				{user &&
					category &&
					user.email === category.created_by_email && (
						<button
							className="edit-button"
							onClick={() => setEditCategory(true)}
						>
							Edit Category
						</button>
					)}

				{cards && (
					<TestCategoryDropdown
						category={category}
						passedCardCount={passedCardCount}
					/>
				)}
			</div>

			<div
				style={{
					
				}}
			>
				<PaginatedCards color={color} />

				{user && addNew && 
				<CardForm category_id={category_id} addNew={addNew} setAddNew={setAddNew} />
				}
			</div>

			{/* Edit Form Modal */}
			{editCategory && (
				<CategoryEditForm
					category={category}
					setCategory={setCategory}
					editCategory={editCategory}
					setEditCategory={setEditCategory}
				/>
			)}

			{confirm && (
				<DeleteModal
					message="Deleting a category will delete all related cards."
					confirm={confirm}
					setConfirm={setConfirm}
					handleConfirm={handleConfirmDelete}
				/>
			)}
		</div>
	);
};

export default Category;
