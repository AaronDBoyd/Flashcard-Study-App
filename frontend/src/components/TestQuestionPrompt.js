import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

const TestQuestionPrompt = ({
	testCard,
	isMultipleChoice,
	multipleAnswerArray,
	submittedInput,
	setSubmittedInput,
	handleSubmit,
	category,
}) => {
	return (
		<>
			<div className="test-question">
				{category && (
					<h2 style={{ color: `${category.color}` }}>
						{testCard && testCard.question}
					</h2>
				)}
			</div>
			<Form onSubmit={handleSubmit}>
				<Form.Group className="mb-3">
					{isMultipleChoice ? (
						multipleAnswerArray.map((answer) => (
							<Form.Check
								type="radio"
								autoFocus
								key={multipleAnswerArray.indexOf(answer)}
								value={answer}
								label={answer}
								checked={submittedInput === { answer }}
								onChange={() => setSubmittedInput(answer)}
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
									setSubmittedInput(e.target.value)
								}
								value={submittedInput}
							/>
						</>
					)}
				</Form.Group>
				{category && (
					<Button
						style={{ background: `${category.color}` }}
						variant="light"
						type="submit"
					>
						Submit
					</Button>
				)}
			</Form>
		</>
	);
};

export default TestQuestionPrompt;
