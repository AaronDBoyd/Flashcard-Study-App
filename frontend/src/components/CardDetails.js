import { useCardContext } from "../hooks/useCardContext";
import { useAuthContext } from "../hooks/useAuthContext";
import { API_BASE_URL } from "../config/serverApiConfig";
import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/esm/Button";

const CardDetails = ({ card }) => {
	const { dispatch } = useCardContext();
	const { user } = useAuthContext();
	const [confirm, setConfirm] = useState(false);

	const handleDelete = async () => {
		// if (!user) {
		// 	return;
		// }
        setConfirm(true)

	};
    
	const handleConfirm = async () => {
    const response = await fetch(API_BASE_URL + "/api/card/" + card._id, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${user.token}`,
        },
    });
    const json = await response.json();

    if (response.ok) {
        dispatch({ type: "DELETE_CARD", payload: json });
    }

    setConfirm(false)
};

    const handleClose = () => {
        setConfirm(false)
    }

	return (
		<>
			<div className="card-details">
				<h4>{card.question}</h4>
				{user && <span onClick={handleDelete}>delete</span>}
			</div>
			<Modal show={confirm} onHide={handleClose}>
				<Modal.Header closeButton>
					<Modal.Title>Are you sure?</Modal.Title>
				</Modal.Header>
				<Modal.Body>Card will be permanently deleted.</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={handleClose}>
						Close
					</Button>
					<Button variant="danger" onClick={handleConfirm}>
						Confirm Delete
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
};

export default CardDetails;
