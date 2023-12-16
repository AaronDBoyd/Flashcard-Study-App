import { useState } from "react";
import { useSignup } from "../hooks/useSignup";
import {
	Button,
	FormControl,
	IconButton,
	InputAdornment,
	InputLabel,
	OutlinedInput,
	TextField,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const Signup = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);

	const { signup, error, isLoading } = useSignup();

	const handleSubmit = async (e) => {
		e.preventDefault();

		await signup(email, password);
	};

	return (
		<form className="signup" onSubmit={handleSubmit}>
			<h3>Sign up</h3>

			<TextField
				sx={{ m: 1, width: "34ch" }}
				label="Email"
				autoFocus
				color="secondary"
				onChange={(e) => setEmail(e.target.value)}
			/>

			<FormControl sx={{ m: 1, width: "34ch" }} variant="outlined">
				<InputLabel htmlFor="password-input" color="secondary">
					Password
				</InputLabel>
				<OutlinedInput
					id="password-input"
					type={showPassword ? "text" : "password"}
					endAdornment={
						<InputAdornment position="end">
							<IconButton
								onClick={() => setShowPassword((show) => !show)}
							>
								{showPassword ? (
									<VisibilityOff />
								) : (
									<Visibility />
								)}
							</IconButton>
						</InputAdornment>
					}
					label="Password"
					color="secondary"
					onChange={(e) => setPassword(e.target.value)}
				/>
				<br />
				<Button
					disabled={isLoading}
					type="submit"
					variant="contained"
					// sx={{ backgroundColor: "#58094f"}}
					color="secondary"
				>
					Sign Up
				</Button>
			</FormControl>

			{error && <div className="error">{error}</div>}
		</form>
	);
};

export default Signup;
