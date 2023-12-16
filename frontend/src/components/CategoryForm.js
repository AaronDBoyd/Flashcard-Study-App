import { useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { useCategoryContext } from "../hooks/useCategoryContext";
import { API_BASE_URL } from "../config/serverApiConfig";
import { useToken } from "../hooks/useToken";
import { BlockPicker, SketchPicker } from "react-color";
import {
	FormControlLabel,
	Checkbox,
	Button,
	TextField,
	Modal,
} from "@mui/material";

const CategoryForm = ({ addNew, setAddNew }) => {
	const { dispatch } = useCategoryContext();
	const { user } = useAuthContext();
	const { resetToken } = useToken();
	const [title, setTitle] = useState("");
	const [isPrivate, setIsPrivate] = useState(false);
	const [error, setError] = useState(null);
	const [emptyFields, setEmptyFields] = useState([]);
	const [isCustomColor, setIsCustomColor] = useState(false);
	const [color, setColor] = useState("#841e62");

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
			setIsCustomColor(false);
			setError(null);
			setEmptyFields([]);
			setAddNew(false);
			console.log("new category added", json);
			dispatch({ type: "CREATE_CATEGORY", payload: json });
		}
	};

	const handleChangeColor = (c) => {
		setColor(c.hex);
	};

	return (
		<Modal open={addNew} onClose={() => setAddNew(false)}>
			<form className="category-form" onSubmit={handleSubmit}>
				<h3> Add a New Category</h3>
				<TextField
					label="Category Title"
					fullWidth
					color="secondary"
					onChange={(e) => setTitle(e.target.value)}
					value={title}
					className={emptyFields.includes("title") ? "error" : ""}
				/>
				<br />
				<FormControlLabel
					control={
						<Checkbox
							size="large"
							value={isPrivate}
							checked={isPrivate}
							onChange={(e) => setIsPrivate((prev) => !prev)}
						/>
					}
					label="Private"
				/>
				<br />
				<FormControlLabel
					control={
						<Checkbox
							size="large"
							value={isCustomColor}
							checked={isCustomColor}
							onChange={(e) => setIsCustomColor((prev) => !prev)}
						/>
					}
					label="Custom Color"
				/>

				{isCustomColor && (
					<BlockPicker
						color={color}
						onChangeComplete={handleChangeColor}
						colors={[
							"#F47373",
							"#697689",
							"#37D67A",
							"#2CCCE4",
							"#555555",
							"#ff8a65",
							"#ba68c8",
							"#58094F",
							"#841E62",
							"#F3AA20",
							"#2A445E",
							"#346B6D",
							"#5809",
						]}
					/>
				)}
				<br />
				<Button
					type="submit"
					variant="contained"
					color="secondary"
					// sx={{ backgroundColor: "#841e62" }}
				>
					Add Category
				</Button>
				{error && <div className="error">{error}</div>}
			</form>
		</Modal>
	);
};

export default CategoryForm;
