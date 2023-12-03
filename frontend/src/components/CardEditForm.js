import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/esm/Button";
import Form from "react-bootstrap/Form";
import { useState } from "react";
import { API_BASE_URL } from "../config/serverApiConfig";
import { useAuthContext } from "../hooks/useAuthContext";
import { useCardContext } from "../hooks/useCardContext";
import { useToken } from "../hooks/useToken";

const CardEditForm = ({ card, edit, setEdit }) => {
	// context
	const { user } = useAuthContext();
	const { dispatch } = useCardContext();

	// state
	const [question, setQuestion] = useState(card.question);
	const [answer, setAnswer] = useState(card.answer);
	const [multipleChoice, setMultipleChoice] = useState(
		card.setMultipleChoice
	);
	
	const { resetToken } = useToken();

	const handleSubmit = async (e) => {
		e.preventDefault();

		const newCard = {
			question,
			answer,
			multiple_choice: multipleChoice,
			_id: card._id,
		};

		const response = await fetch(API_BASE_URL + "/api/card/" + card._id, {
			method: "PATCH",
			body: JSON.stringify(newCard),
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${user.token}`,
			},
		});

		if (!response.ok) {
			if (response.status === 401) {
				resetToken();
				return;
			}
		}
		if (response.ok) {
			setEdit(false);
			dispatch({ type: "UPDATE_CARD", payload: newCard });
		}
	};

	return (
		<Modal show={edit} onHide={() => setEdit(false)}>
			<Modal.Header closeButton>
				<Modal.Title>Edit</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form onSubmit={handleSubmit}>
					<Form.Group>
						<Form.Label>Change Question:</Form.Label>
						<Form.Control
							type="text"
							placeholder={card.question}
							value={question}
							onChange={(e) => setQuestion(e.target.value)}
						/>
					</Form.Group>
					<Form.Group>
						<Form.Label>Answer Question:</Form.Label>
						<Form.Control
							type="text"
							placeholder={card.answer}
							value={answer}
							onChange={(e) => setAnswer(e.target.value)}
						/>
					</Form.Group>
					<Form.Group>
						<Form.Check
							type="checkbox"
							label=" Multiple Choice"
							value={card.multiple_choice}
							checked={card.multiple_choice}
							onChange={() => setMultipleChoice((prev) => !prev)}
						/>
					</Form.Group>
					<br />
					<Button type="submit">Submit</Button>
				</Form>
			</Modal.Body>
		</Modal>
	);
};

export default CardEditForm;
