import { useState } from "react";
import { usePagination } from "../hooks/usePagination";
import { useCardContext } from "../hooks/useCardContext";

// components
import CardDetails from "../components/CardDetails";
import Pagination from "@mui/material/Pagination";

const PaginatedCards = ({ color }) => {
	const { cards } = useCardContext();
	const [page, setPage] = useState(1);
	const PER_PAGE = 10;

	const count = cards ? Math.ceil(cards.length / PER_PAGE) : 1;
	const _DATA = usePagination(cards, PER_PAGE);

	const handleChangePage = (e, p) => {
		setPage(p);
		_DATA.jump(p);
	};

	return (
		<div className="cards">
			{cards &&
				_DATA
					.currentData()
					.map((card) => (
						<CardDetails key={card._id} card={card} color={color} />
					))}
			{!cards && <h3>Use form to add flash cards to this category.</h3>}
			<Pagination
				count={count}
				page={page}
				variant="outlined"
				color="secondary"
				onChange={handleChangePage}
			/>
		</div>
	);
};

export default PaginatedCards;
