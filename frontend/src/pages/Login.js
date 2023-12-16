import { useState } from "react";
import { useLogin } from "../hooks/useLogin";
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

const Login = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);

	const { login, error, isLoading } = useLogin();

	const handleClickShowPassword = () => setShowPassword((show) => !show);

	const handleSubmit = async (e) => {
		e.preventDefault();

		await login(email, password);
	};

	return (
		<form className="login" onSubmit={handleSubmit}>
			<h3>Log in</h3>

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
							<IconButton onClick={handleClickShowPassword}>
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
					color="secondary"
				>
					Login
				</Button>
			</FormControl>
			{error && <div className="error">{error}</div>}
		</form>
	);
};

export default Login;
