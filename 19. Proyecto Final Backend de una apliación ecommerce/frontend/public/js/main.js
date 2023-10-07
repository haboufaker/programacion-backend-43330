window.onload = cartChecker;
// Socket init
const socket = io();
let user;
let chatBox = document.getElementById("chatBox");
let addToCartButtons = document.querySelectorAll("#addToCartBtn");

// Get references to form elements
const productIdInput = document.getElementById('productIdInput');
const productImageInput = document.querySelector('input[name="productImage"]');
const uploadImageBtn = document.getElementById('uploadImageBtn');


// Add to cart button click event
addToCartButtons.forEach(addToCartButton => {
	addToCartButton.addEventListener("click", () => {
		const productId = addToCartButton.dataset.productId;
		console.log(productId)
		addToCart(productId);
	});
})

document.querySelectorAll(".delete-btn").forEach((button) => {
	button.addEventListener("click", async (event) => {
	  const inputField = event.target.previousElementSibling;
	  const round = Math.round;// Get the input field
	  const productId = inputField.value;
	  console.log(`Este es inputfield.value ${productId}`)
	  console.log(productId) // Get the product ID entered by the user
	  try {
		await fetch(`/api/products/${productId}`, {
		  method: "DELETE",
		});
	  } catch (error) {
		console.error("Error deleting product", error);
	  }
	});
});


Swal.fire({
	title: "Please sign in",
	input: "text",
	text: "Please type your username to sign in",
	inputValidator: (value) => {
		return !value && 'You need your username to sign in and use the chat'
	},
	allowOutsideClick:false
}).then(result => {
	user = result.value
	socket.emit('connected1', {user})
	socket.emit('connected2', {user});
});


// Check if cart ID is present in session storage
async function cartChecker() {
	try {
		let userId;
		if (document.getElementById("userId").dataset.userEmail !== "adminCoder@coder.com") {
			userId = document.getElementById("userId").dataset.userId;

			if (!userId) {
				console.error("An error occurred while adding the cart to the user");
			}
		}
		
		let cartId = sessionStorage.getItem("cartId");
  
		if (!cartId) {
			const response = await fetch("/api/carts", {
		  	method: "POST",
			});
  
			if (response.ok) {
			const data = await response.json();
			cartId = data.cartId;
			sessionStorage.setItem("cartId", cartId);

			if (document.getElementById("userId").dataset.userEmail === "adminCoder@coder.com") {
				return cartId;
			} else {
				fetch(`api/sessions/${userId}/cart/${cartId}`, {
					method: "POST",
				  })
					.then((response) => response.json())
					.then((data) => {
					  if (data.Error) {
						// Show error message if product not found
						console.error("Error:", data.Error);
					  } else {
						// Show success message if product added to the cart
						console.log("Success:", data.Message);
					  }
					})
					.catch((error) => {
					  console.error("An error occurred while adding the cart to the user", error);
					});
	
				return cartId;
			}

			
			}
		}
		

		fetch(`api/sessions/${userId}/cart/${cartId}`, {
			method: "POST",
		  })
			.then((response) => response.json())
			.then((data) => {
			  if (data.Error) {
				// Show error message if product not found
				console.error("Error:", data.Error);
			  } else {
				// Show success message if product added to the cart
				console.log("Success:", data.Message);
			  }
			})
			.catch((error) => {
			  console.error("An error occurred while adding the cart to the user", error);
			});

		return cartId
	} catch (error) {
		console.error("An error occurred while adding the cart", error);
	}
}

// Add to cart function
function addToCart(productId) {
	const cartId = sessionStorage.getItem("cartId");
  
	// Make a POST request to add the product to the cart
	fetch(`api/carts/${cartId}/products/${productId}`, {
	  method: "POST",
	})
	  .then((response) => response.json())
	  .then((data) => {
		if (data.Error) {
		  // Show error message if product not found
		  console.error("Error:", data.Error);
		} else {
		  // Show success message if product added to the cart
		  console.log("Success:", data.Message);
		}
	  })
	  .catch((error) => {
		console.error("An error occurred while adding the product to the cart", error);
	  });
};

function purchase() {
	const cartId = sessionStorage.getItem("cartId");
	// Make a POST request to add the product to the cart
	fetch(`api/carts/${cartId}/purchase`, {
		method: "POST",
	})
		.then((response) => response.json())
		.then((data) => {
		if (data.Error) {
			// Show error message if order not completed
			console.error("Error:", data.Error);
		} else {
			// Show success message if order completed
			console.log("Success:", data.Message);
		}
		})
		.catch((error) => {
		console.error("An error occurred while completing the order, please try again later", error);
		});
};


function goToCart() {
	const cartId = sessionStorage.getItem("cartId");
	window.location.href = `/carts?cid=${cartId}`;
}

function addProducts() {
	window.location.href = `/products/add`;
}

function redirectToPremium() {
	const userId = document.getElementById('userIdInput').value;
	const url = `/api/sessions/premium/${userId}`;
	window.location.href = url;
}

function logOut() {
	sessionStorage.clear();
}

// Function to handle profile image upload button click
document.addEventListener("DOMContentLoaded", () => {
	// Handle profile image form submission
	const profileImageForm = document.getElementById("profileImageForm");
	profileImageForm.addEventListener("submit", async (event) => {
		event.preventDefault();

		const formData = new FormData(profileImageForm);

		try {
		const response = await fetch(profileImageForm.action, {
			method: "POST",
			body: formData,
		});

		if (response.ok) {
			alert("Profile image uploaded successfully.");
			// You can optionally reload the page or update the UI here.
		} else {
			alert("Failed to upload profile image.");
		}
		} catch (error) {
		console.error(error);
		alert("An error occurred while uploading the profile image.");
		}
	});
});

function uploadImage() {
	const productId = productIdInput.value;
	const productImage = productImageInput.files[0];

	if (!productId || !productImage) {
		alert('Please enter a Product ID and select an image.');
	return;
	}

	const formData = new FormData();
	
	formData.append('productImage', productImage);

	// Send the formData to the server using fetch or another AJAX method
	fetch(`/api/products/uploadProductImage/${productId}`, {
		method: 'POST',
		body: formData,
	})
}
// Function to handle product image submission
uploadImageBtn.addEventListener('click', () => {
	console.log('Button clicked')
	const productId = productIdInput.value;
	const productImage = productImageInput.files[0]; // Get the selected image file

	if (!productId || !productImage) {
		alert('Please enter a Product ID and select an image.');
	return;
	}

	const formData = new FormData();
	formData.append('productId', productId);
	formData.append('productImage', productImage);

	// Send the formData to the server using fetch or another AJAX method
	fetch('/api/products/uploadProductImage', {
		method: 'POST',
		body: formData,
	})
	.then((response) => response.json())
	.then((data) => {
		// Handle the response from the server
		console.log(data);
	})
	.catch((error) => {
		console.error(error);
	});
});



chatBox.addEventListener('keyup', evt =>{
	if (evt.key=== "Enter") {
		if (chatBox.value.trim().length>0) {
			socket.emit('message', {user, message:chatBox.value});
			chatBox.value = "";
		}
	}
})

function render(data) {
	// Genero el html
	const html = document.getElementById('productsContainer');
	html.innerHTML = '';
	data.forEach(element => {
			const newDiv = document.createElement('div');
			newDiv.classList.add('product')
			newDiv.innerHTML = `
                <p>${element.title}</p>
				<p>${element.description}</p>
				<p>${element.price}</p>
				<p>${element.thumbnail}</p>
				<p>${element.code}</p>
				<p>${element.stock}</p>
				<p>${element.status}</p>
				<p>${element.id}</p>
            `;
			html.appendChild(newDiv);
		});
}

deleteButton.addEventListener("click", (event) => {
	console.log("Delete button clicked!");
	const userId = event.target.dataset.userId;

	// Send a request to delete the user
	fetch(`/api/sessions/${userId}`, {
		method: "DELETE",
	})
	.then((response) => {
		if (response.ok) {
		// User deleted successfully, you can update the UI as needed
		console.log(`User with ID ${userId} deleted.`);
		} else {
		// Handle errors here
		console.error(`Failed to delete user with ID ${userId}.`);
		}
	})
	.catch((error) => {
		console.error(`An error occurred: ${error}`);
	});
});

// Event listener
socket.on('products', (products) => {
	render(products);
});

socket.on('messageLogs', data =>{
	let log = document.getElementById('messageLogs');
	let messages = "";
	data.forEach(message =>{
		messages = messages + `${message.user} says: ${message.message}</br>`
	})
	log.innerHTML = messages;
})

socket.on('connected1', data => {
	Swal.fire({
		text: `${data} has connected`,
		toast: true,
		position: 'top-right',
	});
});