import { useLogout } from "./useLogout";
import { useNavigate } from "react-router-dom";

export const useToken = () => {
	const { logout } = useLogout();
	const navigate = useNavigate();

	const resetToken = () => {
		logout();
		navigate("/login");
	};

	return { resetToken };
};
