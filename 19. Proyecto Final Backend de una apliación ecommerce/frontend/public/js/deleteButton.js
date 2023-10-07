const deleteButton = document.querySelector(".delete-user");

deleteButton.addEventListener("click", (event) => {
	console.log("Delete button clicked!");
	const userId = event.target.dataset.userId;

	// Send a request to delete the user
	fetch(`/api/sessions/${userId}`, {
		method: "DELETE",
	})
});

function goToProducts() {
	window.location.href = '/products';
}