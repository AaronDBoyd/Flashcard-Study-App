import { useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { useCategoryContext } from "../hooks/useCategoryContext";
import { API_BASE_URL } from "../config/serverApiConfig";
import { useToken } from "../hooks/useToken";
import { SketchPicker } from "react-color";

const CategoryForm = () => {
	const { dispatch } = useCategoryContext();
	const { user } = useAuthContext();
	const { resetToken } = useToken();
	const [title, setTitle] = useState("");
	const [isPrivate, setIsPrivate] = useState(false);
	const [error, setError] = useState(null);
	const [emptyFields, setEmptyFields] = useState([]);
	const [isCustomColor, setIsCustomColor] = useState(false);
	const [color, setColor] = useState("#1aac83");

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!user) {
			setError("You must be logged in");
			return;
		}

		const category = { title, isPrivate, color };

		const response = await fetch(API_BASE_URL + "/api/category", {
			method: "POST",
			body: JSON.stringify(category),
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${user.token}`,
			},
		});

		const json = await response.json();

		if (!response.ok) {
			if (response.status === 401) {
				resetToken();
				return;
			}
			setError(json.error);
			setEmptyFields(json.emptyFields);
		}
		if (response.ok) {
			setTitle("");
			setIsPrivate(false);
			setIsCustomColor(false)
			setError(null);
			setEmptyFields([]);
			console.log("new category added", json);
			dispatch({ type: "CREATE_CATEGORY", payload: json });
		}
	};

	const handleChangeColor = (c) => {
		setColor(c.hex);
	};

	return (
		<form className="create" onSubmit={handleSubmit}>
			<h3> Add a New Category</h3>

			<label>Category Title:</label>
			<input
				type="text"
				onChange={(e) => setTitle(e.target.value)}
				value={title}
				className={emptyFields.includes("title") ? "error" : ""}
			/>

			{/* private field */}
			<div
				className="checkbox-wrapper"
				style={{
					display: "flex",
					justifyContent: "flex-start",
					width: "200px",
					marginLeft: "-40px",
					height: "70px",
					fontSize: "20px",
				}}
			>
				<input
					type="checkbox"
					value={isPrivate}
					checked={isPrivate}
					onChange={(e) => setIsPrivate((prev) => !prev)}
				/>
				<label>Private</label>
			</div>

			{/* color */}
			<label>Color:</label>
			<br />
			<div
				className="checkbox-wrapper"
				style={{
					display: "flex",
					justifyContent: "flex-start",
					width: "200px",
					marginLeft: "-20px",
				}}
			>
				<input
					type="checkbox"
					value={isCustomColor}
					checked={isCustomColor}
					onChange={(e) => setIsCustomColor((prev) => !prev)}
				/>
				<label>Check for custom color</label>
			</div>

			{isCustomColor && (
				<SketchPicker
					color={color}
					onChangeComplete={handleChangeColor}
				/>
			)}
			<br />
			<button>Add Category</button>
			{error && <div className="error">{error}</div>}
		</form>
	);
};

export default CategoryForm;
