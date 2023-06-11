// Socket init
const socket = io();
let user;
let chatBox = document.getElementById("chatBox");

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
}),

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
	console.log(data)
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



// Event listener
socket.on('products', (products) => {
	console.log(products)
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

