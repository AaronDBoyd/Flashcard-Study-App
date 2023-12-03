import { useEffect, useState, useCallback } from "react";
import { useCardContext } from "../hooks/useCardContext";
import { shuffleArray } from "../helpers/shuffleArray";
import { useAuthContext } from "../hooks/useAuthContext";
import { API_BASE_URL } from "../config/serverApiConfig";

// components
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import AnswerRevealModal from "../components/AnswerRevealModal";

const Test = () => {
	// context
	const { cards } = useCardContext();
	const { user, dispatch } = useAuthContext();

	// state
	const [testInput, setTestInput] = useState("");
	const [testCard, setTestCard] = useState(null);
	const [showAnswer, setShowAnswer] = useState(false);
	const [totalCards, setTotalCards] = useState(0);
	const [currentCardNumber, setCurrentCardNumber] = useState(1);
	const [isCorrect, setIsCorrect] = useState(false);
	const [isMultipleChoice, setIsMultipleChoice] = useState(false);
	const [multipleAnswerArray, setMultipleAnswerArray] = useState([]);
	const [referenceAnswerArray] = useState(cards.slice());

	const assignMultipleAnswerArray = useCallback(() => {
		let answerArray = [];

		// push current card answer into answerArray
		answerArray.push(cards[0].answer);

		const min = 0;
		const max = referenceAnswerArray.length;

		while (
			answerArray.length < 4 &&
			answerArray.length < referenceAnswerArray.length
		) {
			const randomIndex = Math.floor(Math.random() * (max - min) + min);

			// look at random index in cards array answers
			if (
				!answerArray.includes(referenceAnswerArray[randomIndex].answer)
			) {
				// push answer into answerArray
				answerArray.push(referenceAnswerArray[randomIndex].answer);
			}
		}

		// shuffle array
		shuffleArray(answerArray);
		setMultipleAnswerArray(answerArray);
	}, [cards, referenceAnswerArray]);

	useEffect(() => {
		shuffleArray(cards);
		setTestCard(cards[0]);
		setTotalCards(cards.length);
		setIsMultipleChoice(cards[0].multiple_choice);

		if (cards[0].multiple_choice) {
			assignMultipleAnswerArray();
		}
	}, [cards, assignMultipleAnswerArray]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setShowAnswer(true);
		setTestInput("");
		if (testCard.answer.toLowerCase() === testInput.toLowerCase() && user) {
			setIsCorrect(true);
			passCard(testCard._id);
		}
	};

	const handleNext = () => {
		cards.shift();
		setTestCard(cards[0]);
		setShowAnswer(false);
		setCurrentCardNumber((prev) => prev + 1);
		setIsCorrect(false);
		setIsMultipleChoice(cards[0].multiple_choice);
		if (cards[0].multiple_choice) {
			assignMultipleAnswerArray();
		}
	};

	// add passed card ID to user.passedCards array
	const passCard = async (cardId) => {
		if (!user.passedCards.includes(cardId)) {
			// add cardId to local instance of user
			user.passedCards.push(cardId);

			// update user's passedCards array in database
			const response = await fetch(API_BASE_URL + "/api/user/", {
				method: "PATCH",
				headers: {
					Authorization: `Bearer ${user.token}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify(user),
			});

			if (response.ok) {
				// update authcontext
				dispatch({
					type: "PASS_CARD",
					payload: { passedCards: [...user.passedCards] },
				});

				// update user in local storage
				localStorage.setItem("user", JSON.stringify(user));
			}
		}
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
						{isMultipleChoice ? (
							multipleAnswerArray.map((answer) => (
								<Form.Check
									type="radio"
									key={multipleAnswerArray.indexOf(answer)}
									value={answer}
									label={answer}
									checked={testInput === { answer }}
									onChange={() => setTestInput(answer)}
								/>
							))
						) : (
							<>
								<Form.Label>Answer</Form.Label>
								<Form.Control
									type="text"
									placeholder="type answer"
									autoFocus
									onChange={(e) =>
										setTestInput(e.target.value)
									}
									value={testInput}
								/>
							</>
						)}
					</Form.Group>
					<Button variant="info" type="submit">
						Submit
					</Button>
				</Form>
			</div>

			{showAnswer && (
				<AnswerRevealModal
					showAnswer={showAnswer}
					testCard={testCard}
					isCorrect={isCorrect}
					currentCardNumber={currentCardNumber}
					totalCards={totalCards}
					handleNext={handleNext}
				/>
			)}
		</div>
	);
};

export default Test;
