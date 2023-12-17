import { useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { useCardContext } from "../hooks/useCardContext";
import { API_BASE_URL } from "../config/serverApiConfig";
import { useToken } from "../hooks/useToken";
import { FormControlLabel, Modal } from "@mui/material";
import { Checkbox } from "@mui/material";

const CardForm = ({ category_id, addNew, setAddNew }) => {
	const { user } = useAuthContext();
	const { dispatch } = useCardContext();
	const { resetToken } = useToken();

	const [question, setQuestion] = useState("");
	const [answer, setAnswer] = useState("");
	const [isMultipleChoice, setIsMultipleChoice] = useState(false);
	//const [tags, setTags] = useState([])
	const [error, setError] = useState(null);
	const [emptyFields, setEmptyFields] = useState([]);

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!user) {
			setError("You must be logged in");
			return;
		}

		const card = {
			question,
			answer,
			category_id,
			multiple_choice: isMultipleChoice,
		};

		const response = await fetch(API_BASE_URL + "/api/card", {
			method: "POST",
			body: JSON.stringify(card),
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
			setEmptyFields((e) => e + json.emptyFields);

			console.log(json.error);
		}
		if (response.ok) {
			setQuestion("");
			setAnswer("");
			setIsMultipleChoice(false);
			setError(null);
			setEmptyFields([]);
			setAddNew(false);
			dispatch({ type: "CREATE_CARD", payload: json });
		}
	};

	return (
		<Modal open={addNew} onClose={() => setAddNew(false)}>
			<form className="card-form" onSubmit={handleSubmit}>
				<h3>Create New Card</h3>
				<label>Question:</label>
				<input
					type="text"
					onChange={(e) => setQuestion(e.target.value)}
					value={question}
					className={emptyFields.includes("question") ? "error" : ""}
				/>

				<label>Answer:</label>
				<input
					type="text"
					onChange={(e) => setAnswer(e.target.value)}
					value={answer}
					className={emptyFields.includes("answer") ? "error" : ""}
				/>

				<FormControlLabel
					control={
						<Checkbox
							size="large"
							value={isMultipleChoice}
							checked={isMultipleChoice}
							onChange={(e) =>
								setIsMultipleChoice((prev) => !prev)
							}
						/>
					}
					label="Multiple Choice"
				/>

				<br />
				<button>Add Card</button>
				{error && <div className="error">{error}</div>}
			</form>
		</Modal>
	);
};

export default CardForm;
