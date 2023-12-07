import { useCardContext } from "../hooks/useCardContext";
import { useAuthContext } from "../hooks/useAuthContext";
import { API_BASE_URL } from "../config/serverApiConfig";
import { useState } from "react";

// components
import CardEditForm from "./CardEditForm";
import DeleteModal from "./DeleteModal";

const CardDetails = ({ card, color }) => {
	// context
	const { dispatch } = useCardContext();
	const { user, dispatch: authDispatch } = useAuthContext();

	// state
	const [confirm, setConfirm] = useState(false);
	const [edit, setEdit] = useState(false);

	// Click Delete button
	const handleDelete = async () => {
		setConfirm(true);
	};

	// Click Confirm Delete
	const handleConfirm = async () => {
		const response = await fetch(API_BASE_URL + "/api/card/" + card._id, {
			method: "DELETE",
			headers: {
				Authorization: `Bearer ${user.token}`,
			},
		});
		const json = await response.json();

		if (response.ok) {
			// remove card from card context
			dispatch({ type: "DELETE_CARD", payload: json });

			// remove deleted card from local storage user
			user.passedCardIds = user.passedCardIds.filter(c => c !== card._id)

			// update user's passedCardIds array in database
			const updateResponse = await fetch(API_BASE_URL + "/api/user/", {
				method: "PATCH",
				headers: {
					Authorization: `Bearer ${user.token}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify(user),
			});

			if (updateResponse.ok) {
				// update auth context
				authDispatch({
					type: "PASS_CARD",
					payload: user ,
				});

				// update user in local storage
				localStorage.setItem("user", JSON.stringify(user));
			}
		}

		setConfirm(false);
	};

	return (
		<>
			<div className="card-details">
				<div style={{ color: `${color}` }}>
					<h4>{card.question}</h4>
				</div>

				{user && (
					<span
						style={{ right: "150px" }}
						onClick={() => setEdit(true)}
					>
						Edit
					</span>
				)}

				{user && (
					<span style={{ right: "20px" }} onClick={handleDelete}>
						Delete
					</span>
				)}
			</div>
			{/* Edit Form Modal */}
			{edit && <CardEditForm card={card} edit={edit} setEdit={setEdit} />}

			{confirm && (
				<DeleteModal
					message="Card will be permanently deleted."
					confirm={confirm}
					setConfirm={setConfirm}
					handleConfirm={handleConfirm}
				/>
			)}
		</>
	);
};

export default CardDetails;
