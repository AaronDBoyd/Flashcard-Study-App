import { useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { useCategoryContext } from "../hooks/useCategoryContext";
import { API_BASE_URL } from "../config/serverApiConfig";
import { useToken } from "../hooks/useToken";

const CategoryForm = () => {
	const { dispatch } = useCategoryContext();
	const { user } = useAuthContext();
	const { resetToken } = useToken();
	const [title, setTitle] = useState("");
	const [isPrivate, setIsPrivate] = useState(false);
	const [color, setColor] = useState("Black");
	const [error, setError] = useState(null);
	const [emptyFields, setEmptyFields] = useState([]);

	const colorsArray = ["Blue", "Green", "Purple", "Orange"];

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!user) {
			setError("You must be logged in");
			return;
		}

		console.log(isPrivate);

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
			setError(null);
			setEmptyFields([]);
			console.log("new category added", json);
			dispatch({ type: "CREATE_CATEGORY", payload: json });
		}
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
			{colorsArray.map((c) => (
				<div
					className="checkbox-wrapper"
					key={c}
					style={{ width: "200px" }}
				>
					<input
						type="radio"
						value={c}
						checked={color === `${ c }`}
						onChange={() => setColor(c)}
					/>
					<label style={{ color: `${ c }` }}>{c}</label>
				</div>
			))}
			<button>Add Category</button>
			{error && <div className="error">{error}</div>}
		</form>
	);
};

export default CategoryForm;
