import { useState } from "react";
import { API_BASE_URL } from "../config/serverApiConfig";
import { useAuthContext } from "../hooks/useAuthContext";
import { useCategoryContext } from "../hooks/useCategoryContext";
import { useToken } from "../hooks/useToken";

// components
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/esm/Button";
import Form from "react-bootstrap/Form";
import { SketchPicker } from "react-color";

const CategoryEditForm = ({
	category,
	setCategory,
	editCategory,
	setEditCategory,
}) => {
    // context
	const { user } = useAuthContext();
	const { dispatch } = useCategoryContext();

    // state
	const [title, setTitle] = useState(category.title);
	const [isPrivate, setIsPrivate] = useState(category.isPrivate);
	const [isCustomColor, setIsCustomColor] = useState(false);
	const [color, setColor] = useState(category.color);

	const { resetToken } = useToken();

	const handleChangeColor = (c) => {
		setColor(c.hex);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		const newCategory = {
			title,
			isPrivate,
			color,
			_id: category._id,
		};

		const response = await fetch(
			API_BASE_URL + "/api/category/" + category._id,
			{
				method: "PATCH",
				body: JSON.stringify(newCategory),
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${user.token}`,
				},
			}
		);

		if (!response.ok) {
			if (response.status === 401) {
				resetToken();
				return;
			}
		}
		if (response.ok) {
			setEditCategory(false);
			dispatch({ type: "UPDATE_CATEGORY", payload: newCategory });
			setCategory({ ...category, ...newCategory });
		}
	};

	return (
		<Modal show={editCategory} onHide={() => setEditCategory(false)}>
			<Modal.Header closeButton>
				<Modal.Title>Edit</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form onSubmit={handleSubmit}>
					<Form.Group>
						<Form.Label>Change Title:</Form.Label>
						<Form.Control
							type="text"
							placeholder={title}
							value={title}
							onChange={(e) => setTitle(e.target.value)}
						/>
					</Form.Group>

					<Form.Group onClick={() => setIsPrivate((prev) => !prev)}>
						<Form.Check
							type="checkbox"
							label=" Private"
							value={isPrivate}
							checked={isPrivate}
							onChange={() => setIsPrivate((prev) => !prev)}
						/>
					</Form.Group>
					<br />
					<Form.Group
						onClick={() => setIsCustomColor((prev) => !prev)}
					>
						<Form.Check
							type="checkbox"
							label=" Custom Color"
							value={isCustomColor}
							checked={isCustomColor}
							onClick={() => setIsCustomColor((prev) => !prev)}
							onChange={() => setIsCustomColor((prev) => !prev)}
						/>
					</Form.Group>

					{isCustomColor && (
						<SketchPicker
							color={color}
							onChangeComplete={handleChangeColor}
						/>
					)}

					<br />
					<Button type="submit">Submit</Button>
				</Form>
			</Modal.Body>
		</Modal>
	);
};

export default CategoryEditForm;
