import { useEffect, useState, useCallback } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { useCardContext } from "../hooks/useCardContext";
import { useCategoryContext } from "../hooks/useCategoryContext";
import { shuffleArray } from "../helpers/shuffleArray";
import { API_BASE_URL } from "../config/serverApiConfig";

// components
import AnswerRevealModal from "../components/AnswerRevealModal";
import TestQuestionPrompt from "../components/TestQuestionPrompt";

const Test = () => {
	// context
	const { cards } = useCardContext();
	const { user, dispatch } = useAuthContext();
	const { categories } = useCategoryContext();

	// state
	const [referenceAnswerArray] = useState(cards.slice()); // keep a copy of all cards for multiple choice cards
	const [totalCards] = useState(cards.length);
	const [submittedInput, setSubmittedInput] = useState("");
	const [testCard, setTestCard] = useState(null);
	const [currentCategory, setCurrentCategory] = useState(null);
	const [showAnswer, setShowAnswer] = useState(false);
	const [currentCardNumber, setCurrentCardNumber] = useState(1);
	const [isCorrect, setIsCorrect] = useState(false);
	const [isMultipleChoice, setIsMultipleChoice] = useState(false);
	const [multipleAnswerArray, setMultipleAnswerArray] = useState([]);

	const assignMultipleAnswerArray = useCallback(() => {
		let answerArray = [];

		// push current card answer into answerArray
		answerArray.push(cards[0].answer);

		// only select multiple choice options from the same category as the current testCard (when testing multiple categories)
		const currentCategoryCardArray = referenceAnswerArray.filter(
			(c) => c.category_id === cards[0].category_id
		);
		const min = 0;
		const max = currentCategoryCardArray.length;

		while (
			answerArray.length < 4 &&
			answerArray.length < currentCategoryCardArray.length
		) {
			// get random answer from cards array
			const randomIndex = Math.floor(Math.random() * (max - min) + min);
			const randomAnswer = currentCategoryCardArray[randomIndex].answer;

			if (!answerArray.includes(randomAnswer)) {
				// push answer into answerArray
				answerArray.push(randomAnswer);
			}
		}

		// shuffle array so the correct answer is not always first
		shuffleArray(answerArray);
		setMultipleAnswerArray(answerArray);
	}, [cards, referenceAnswerArray]);

	const assignCurrentCategory = useCallback(() => {
		setCurrentCategory(
			categories.filter((c) => c._id === cards[0].category_id)[0]
		);
	}, [categories, cards]);

	useEffect(() => {
		shuffleArray(cards);
	}, [cards]);

	useEffect(() => {
		setTestCard(cards[0]);
		setIsMultipleChoice(cards[0].multiple_choice);
		assignCurrentCategory();

		if (cards[0].multiple_choice) {
			assignMultipleAnswerArray();
		}
	}, [cards, assignMultipleAnswerArray, assignCurrentCategory]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setShowAnswer(true);
		if (
			testCard.answer.toLowerCase() === submittedInput.toLowerCase() &&
			user
		) {
			setIsCorrect(true);
			passCard(testCard._id);
		}
		setSubmittedInput("");
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

	// add passed card ID to user.passedCardIds array
	const passCard = async (cardId) => {
		if (!user.passedCardIds.includes(cardId)) {
			// add cardId to local instance of user
			user.passedCardIds.push(cardId);
			user.passedCardCount++

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
					payload: user ,
				});

				// update user in local storage
				localStorage.setItem("user", JSON.stringify(user));
			}
		}
	};

	return (
		<div>
			<div className="test">
				<div>
					{currentCategory && (
						<div style={{ color: `${currentCategory.color}` }}>
							<h4>{currentCategory.title}</h4>
						</div>
					)}
					<div className="text-end">
						<h4>
							Card {currentCardNumber} of {totalCards}
						</h4>
					</div>
				</div>
				<TestQuestionPrompt
					testCard={testCard}
					isMultipleChoice={isMultipleChoice}
					multipleAnswerArray={multipleAnswerArray}
					submittedInput={submittedInput}
					setSubmittedInput={setSubmittedInput}
					handleSubmit={handleSubmit}
				/>
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
