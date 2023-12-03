import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/esm/Button";

const DeleteModal = ({ message, confirm, setConfirm, handleConfirm }) => {
	return (
		<Modal show={confirm} onHide={() => setConfirm(false)}>
			<Modal.Header closeButton>
				<Modal.Title>Are you sure?</Modal.Title>
			</Modal.Header>
			<Modal.Body>{message}</Modal.Body>
			<Modal.Footer>
				<Button variant="secondary" onClick={() => setConfirm(false)}>
					Close
				</Button>
				<Button variant="danger" onClick={handleConfirm}>
					Confirm Delete
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default DeleteModal;
