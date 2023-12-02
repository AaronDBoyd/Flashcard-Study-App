import { Link, useLocation } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";
import { useAuthContext } from "../hooks/useAuthContext";
import { useEffect } from "react";

const Navbar = ({ handleSearch, input, resetCategories }) => {
	const { logout } = useLogout();
	const { user } = useAuthContext();
	const location = useLocation();

	const handleClick = () => {
		logout();
	};

	// attempt to reset search bar when location is changed
	useEffect(() => {
		const doesAnyHistoryEntryExist = location.key !== "default";
		if (doesAnyHistoryEntryExist) {
			resetCategories("");
		}
	}, [location]);

	return (
		<header>
			<div className="container">
				<Link to="/">
					<h1>Flash Study</h1>
				</Link>
				<div>
					<input
						placeholder="search"
						value={input}
						onChange={handleSearch}
					/>
				</div>
				<nav>
					{user && (
						<div>
							<span>{user.email}</span>
							<button onClick={handleClick}>Log out</button>
							<p>Points: {user.passedCards.length}</p>
						</div>
					)}
					{!user && (
						<div>
							<Link to="/login">Login</Link>
							<Link to="/signup">Signup</Link>
						</div>
					)}
				</nav>
			</div>
		</header>
	);
};

export default Navbar;
