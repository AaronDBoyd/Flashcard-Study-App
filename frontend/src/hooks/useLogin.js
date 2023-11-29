import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { API_BASE_URL } from "../config/serverApiConfig";

export const useLogin = () => {
	const [error, setError] = useState(null);
	const [isLoading, setIsLoading] = useState(null);
	const { dispatch } = useAuthContext();
	const navigate = useNavigate();
	const location = useLocation();

	const login = async (email, password) => {
		setIsLoading(true);
		setError(null);

		const response = await fetch(API_BASE_URL + "/api/user/login", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ email, password }),
		});
		const json = await response.json();

		if (!response.ok) {
			setIsLoading(false);
			setError(json.error);
		}
		if (response.ok) {
			// save the user to local storage
			localStorage.setItem("user", JSON.stringify(json));

			// navigate to previous page
			const doesAnyHistoryEntryExist = location.key !== "default";
			if (doesAnyHistoryEntryExist) {
				navigate(-1);
			}

			// update the auth context
			dispatch({ type: "LOGIN", payload: json });

			// update loading state
			setIsLoading(false);
		}
	};

	return { login, isLoading, error };
};
