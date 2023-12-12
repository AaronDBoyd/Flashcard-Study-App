import { useState } from "react";
import { useCardContext } from "../hooks/useCardContext";
import { useAuthContext } from "../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";

// components
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

const TestCategoryDropdown = ({ category, passedCardCount }) => {
	const { user } = useAuthContext();
	const { cards, dispatch: cardDispatch } = useCardContext();

	const [anchorEl, setAnchorEl] = useState(null);
	const open = Boolean(anchorEl);

	const navigate = useNavigate();

	const handleClickTest = (e) => {
		setAnchorEl(e.currentTarget);
	};

	const handleCloseTest = () => {
		setAnchorEl(null);
	};

	const handleReviewPassed = () => {
		const passedCards = cards.filter((c) =>
			user.passedCardIds.includes(c._id)
		);
		cardDispatch({ type: "SET_CARDS", payload: passedCards });

		navigate(`/test/${category.title}`);
	};

	const handleTestRemaining = () => {
		const remainingCards = cards.filter(
			(c) => !user.passedCardIds.includes(c._id)
		);
		cardDispatch({ type: "SET_CARDS", payload: remainingCards });

		navigate(`/test/${category.title}`);
	};

	const handleTestCategory = () => {
		navigate(`/test/${category.title}`);
	};

	return (
		<div>
			<Button
				id="test-button"
				variant="contained"
				color="secondary"
				size="large"
				aria-controls={open ? "test-menu" : undefined}
				aria-haspopup="true"
				aria-expanded={open ? "true" : undefined}
				onClick={handleClickTest}
			>
				Test
			</Button>
			<Menu
				id="test-menu"
				anchorEl={anchorEl}
				open={open}
				onClose={handleCloseTest}
			>
				<MenuItem
					onClick={handleTestCategory}
					disabled={!cards || cards.length === 0 || !category}
				>
					Test Category
				</MenuItem>
				<MenuItem
					onClick={handleReviewPassed}
					disabled={!cards || passedCardCount === 0 || !category}
				>
					Review Passed Cards
				</MenuItem>
				<MenuItem
					onClick={handleTestRemaining}
					disabled={!cards || passedCardCount === cards.length}
				>
					Test Remaining Cards
				</MenuItem>
			</Menu>
		</div>
	);
};

export default TestCategoryDropdown;
