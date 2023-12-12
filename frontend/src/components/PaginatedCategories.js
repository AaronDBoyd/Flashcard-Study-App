import { useState } from "react";
import { usePagination } from "../hooks/usePagination"
import { Link } from 'react-router-dom'

// components
import Pagination from '@mui/material/Pagination';
import CategoryDetails from "../components/CategoryDetails";

const PaginatedCategories = ({filteredCategories}) => {
	const [page, setPage] = useState(1);
	const PER_PAGE = 10;

	const count = filteredCategories
		? Math.ceil(filteredCategories.length / PER_PAGE)
		: 1;
	const _DATA = usePagination(filteredCategories, PER_PAGE);

	const handleChangePage = (e, p) => {
		setPage(p);
		_DATA.jump(p);
	};

	return (
		<div>
			<div className="categories">
				{/* if myCategories NOT toggled (default) show all, 
					else only show users categories */}
				{filteredCategories &&
					_DATA.currentData().map((category) => (
						<Link
							to={`/category/${category.title}`}
							key={category._id}
							state={{
								category_id: `${category._id}`,
							}}
						>
							<CategoryDetails
								category={category}
								key={category._id}
							/>
						</Link>
					))}
			</div>
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

export default PaginatedCategories;
