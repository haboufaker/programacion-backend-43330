let purchaseButton = document.getElementById("purchaseBtn");

// Purchase button click event
purchaseButton.addEventListener("click", () => {
    purchase();
});

function purchase() {
    const cartId = sessionStorage.getItem("cartId");
    console.log(`Este es el cartId de purchase ${cartId}`)
    let userId;
    if (document.getElementById("userId").dataset.userEmail !== "adminCoder@coder.com") {
        userId = document.getElementById("userId").dataset.userId;
    }

    
    fetch(`/api/carts/${cartId}/purchase`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json" // Set the Content-Type header to indicate JSON data
        },
        body: JSON.stringify({ uid: userId }) // Send the userId as JSON data in the request body
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.Error) {
                // Show error message if order not completed
                console.error("Error:", data.Error);
            } else {
                // Show success message if order completed
                console.log("Success:", data.Message);
                // Redirect back to the products page with a success message
                window.location.href = '/products?message=Order+processed+successfully';
            }
        })
        .catch((error) => {
            console.error("An error occurred while completing the order, please try again later", error);
        });
}


function goToProducts() {
	window.location.href = '/products';
}