import { useNavigate } from "react-router-dom";

// components
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ModalBody from "react-bootstrap/esm/ModalBody";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

const AnswerRevealModal = ({
	showAnswer,
	testCard,
	isCorrect,
    currentCardNumber,
	totalCards,
	handleNext,
}) => {

    const navigate = useNavigate();

	return (
		<Modal
			show={showAnswer}
			className="test-answer-modal"
			size="lg"
			centered="true"
		>
			<ModalBody className="text-center my-5">
				<h3>{testCard && testCard.answer}</h3>
			</ModalBody>
			<Modal.Footer>
				<Container>
					<Row>
						<Col xs={9}>
							<div>
								{testCard && isCorrect ? (
									<h3>Correct!</h3>
								) : (
									<h3>Incorrect</h3>
								)}
							</div>
						</Col>
						<Col xs={3}>
							{currentCardNumber < totalCards ? (
								<Button
									className="next-button"
									variant="info"
									type="submit"
									onClick={handleNext}
									autoFocus
								>
									Next
								</Button>
							) : (
								<Button
									className="next-button"
									variant="outline-info"
									type="submit"
									onClick={() => navigate("/")}
									autoFocus
								>
									Go Home
								</Button>
							)}
						</Col>
					</Row>
				</Container>
			</Modal.Footer>
		</Modal>
	);
};

export default AnswerRevealModal;
