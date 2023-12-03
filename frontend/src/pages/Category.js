import { useParams, useLocation, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config/serverApiConfig";
import { useCardContext } from "../hooks/useCardContext";
import { useAuthContext } from "../hooks/useAuthContext";
import { useCategoryContext } from "../hooks/useCategoryContext";

// components
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/esm/Button";
import CardDetails from "../components/CardDetails";
import CardForm from "../components/CardForm";
import CategoryEditForm from "../components/CategoryEditForm"

const Category = () => {
	const { title } = useParams();

	// context
	const { user } = useAuthContext();
	const { cards, dispatch } = useCardContext();
	const { dispatch: categoryDispatch } = useCategoryContext();

	// state
	const [category, setCategory] = useState(null);
	const [notice, setNotice] = useState("");
	const [confirm, setConfirm] = useState(false);
	const [color, setColor] = useState("");
	const [editCategory, setEditCategory] = useState(false)

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
				dispatch({ type: "SET_CARDS", payload: json });
			}
		};

		fetchCategory();
		fetchCards();
	}, [category_id, dispatch]);

	// DELETE CATEGORY
	const handleDelete = () => {
		if (!user || user.email !== category.created_by_email) {
			setNotice(
				"Must be signed in and category creator to delete a category"
			);
			return;
		} else {
			setConfirm(true);
		}
	};

	const handleClose = () => setConfirm(false);

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
			await categoryDispatch({ type: "SET_CATEGORIES", payload: null });
			navigate("/");
		}
	};

	const handleEditCategory = () => {
		setEditCategory(true)
	}

	return (
		<div>
			<h2>
				{category && <span style={{ color: `${category.color}` }}>{category.title}</span>} Flash Cards 
			</h2>

			{user && category && user.email === category.created_by_email && (
				<button className="delete-button" onClick={handleDelete}>
					Delete Category{" "}
				</button>
			)}

			{user && category && user.email === category.created_by_email && (
				<button className="edit-button" onClick={handleEditCategory}>
					Edit Category
				</button>
			)}

			{cards && (
				<Link to={`/test/${title}`}>
					<span className="test-button">Test Category </span>
				</Link>
			)}
			{notice && <span className="error">{notice}</span>}
			<div className="cards">
				<div>
					{cards &&
						cards.map((card) => (
							<CardDetails
								key={card._id}
								card={card}
								color={color}
							/>
						))}
					{!cards && (
						<h3>Use form to add flash cards to this category.</h3>
					)}
				</div>

				<CardForm category_id={category_id} />
			</div>
						{/* Edit Form Modal */}
			{editCategory && <CategoryEditForm category={category} setCategory={setCategory} editCategory={editCategory} setEditCategory={setEditCategory} />}

			<Modal show={confirm} onHide={handleClose}>
				<Modal.Header closeButton>
					<Modal.Title>Are you sure?</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					Deleting a category will delete all related cards.
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={handleClose}>
						Close
					</Button>
					<Button variant="danger" onClick={handleConfirmDelete}>
						Confirm Delete
					</Button>
				</Modal.Footer>
			</Modal>
		</div>
	);
};

export default Category;
