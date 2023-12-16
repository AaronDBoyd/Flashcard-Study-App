import { useLocation, useNavigate } from "react-router-dom";
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

const Category = () => {
	// context
	const { user } = useAuthContext();
	const { cards, dispatch: cardDispatch } = useCardContext();
	const { dispatch: categoryDispatch } = useCategoryContext();

	// state
	const [category, setCategory] = useState(null);
	const [confirm, setConfirm] = useState(false);
	const [color, setColor] = useState("");
	const [editCategory, setEditCategory] = useState(false);
	const [passedCardCount, setPassedCardCount] = useState(0);

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
		<div style={{color: 'whitesmoke'}}>
			<h2>
				{category && (
					<span style={{ color: `${category.color}` }}>
						{category.title}
					</span>
				)}{" "}
				Flash Cards
			</h2>
			{cards && (
				<h3>
					Passed: {passedCardCount} of {cards.length}
				</h3>
			)}

			{user && category && user.email === category.created_by_email && (
				<button
					className="delete-button"
					onClick={() => setConfirm(true)}
				>
					Delete Category{" "}
				</button>
			)}

			{user && category && user.email === category.created_by_email && (
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

			<div
				style={{
					display: "grid",
					gridTemplateColumns: "5fr 3fr",
					gap: "100px",
				}}
			>
				<PaginatedCards color={color} />
				<CardForm category_id={category_id} />
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
