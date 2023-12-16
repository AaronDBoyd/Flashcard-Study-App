import { Link } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";
import { useAuthContext } from "../hooks/useAuthContext";

const Navbar = () => {
	const { logout } = useLogout();
	const { user } = useAuthContext();

	const handleClick = () => {
		logout();
	};

	return (
		<header>
			<div className="container">				
				<Link to="/">
					<div className="title-button">

					<h1>Flash Study</h1>
					</div>
				</Link>
				<nav>
					{user && (
						<div>
							<span>{user.email}</span>							
							<button onClick={handleClick}>Log out</button>
							<p>Points: {user.passedCardCount}</p>
						</div>
					)}
					{!user && (
						<div>
							<Link to="/login">Login</Link>
							<span>&nbsp;&nbsp;|</span>
							<Link to="/signup">Signup</Link>
						</div>
					)}
				</nav>
			</div>
		</header>
	);
};

export default Navbar;
