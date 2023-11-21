import { useEffect, useState } from "react";
import { useCardContext } from "../hooks/useCardContext";
import { shuffleArray } from "../helpers/shuffleArray";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ModalBody from "react-bootstrap/esm/ModalBody";
import { useNavigate } from "react-router-dom";

const Test = () => {
	const { cards } = useCardContext();
	const [testInput, setTestInput] = useState("");
	const [testCard, setTestCard] = useState(null);
	const [showAnswer, setShowAnswer] = useState(false);
	const [totalCards, setTotalCards] = useState(0);
	const [currentCardNumber, setCurrentCardNumber] = useState(1);
    const [isCorrect, setIsCorrect] = useState(false)

	const navigate = useNavigate();

	useEffect(() => {
		shuffleArray(cards);
		setTestCard(cards[0]);
		setTotalCards(cards.length);
	}, [cards]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setShowAnswer(true);
        setTestInput('')
        if (testCard.answer.toLowerCase() === testInput.toLowerCase()){
            setIsCorrect(true)
        }
	};

	const handleNext = () => {
		cards.shift();
		setTestCard(cards[0]);
		setShowAnswer(false);
		setCurrentCardNumber((prev) => prev + 1);
        setIsCorrect(false)
	};

	const handleHome = () => {
		navigate("/");
	};

	return (
		<div>
			<div className="test">
				<div className="text-end">
					<h4>
						Card {currentCardNumber} of {totalCards}
					</h4>
				</div>
				<div className="test-question">
					<h2>{testCard && testCard.question}</h2>
				</div>
				<Form onSubmit={handleSubmit}>
					<Form.Group className="mb-3">
						<Form.Label>Answer</Form.Label>
						<Form.Control
							type="text"
							placeholder="type answer"
							onChange={(e) => setTestInput(e.target.value)}
							value={testInput}
						/>
					</Form.Group>
					<Button variant="info" type="submit">
						Submit
					</Button>
				</Form>
			</div>
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
									{testCard &&
										isCorrect ? (
											<h3>Correct!</h3>
										) : (
											<h3>Incorrect</h3>
										) }

								</div>
							</Col>
							<Col xs={3}>
								{currentCardNumber < totalCards ? (
									<Button
										className="next-button"
										variant="info"
										onClick={handleNext}
										
									>
										Next
									</Button>
								) : (
									<Button
										className="next-button"
										variant="outline-info"
										onClick={handleHome}
										
									>
										 Go Home
									</Button>
								)}
							</Col>
						</Row>
					</Container>
				</Modal.Footer>
			</Modal>
		</div>
	);
};

export default Test;
