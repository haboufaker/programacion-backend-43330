// Socket init
const socket = io();

/**function sendProduct() {
	// Obtengo el mensaje del input
	const form = document.querySelector('form')
	let product = Object.values(form).reduce((obj,field) => { obj[field.name] = field.value; return obj }, {})
	// Envío el mensaje al servidor
	socket.emit('new-product', product);
}

function deleteProduct() {
	// Obtengo el mensaje del input
	const id = document.getElementById('id').value;
	// Envío el mensaje al servidor
	socket.emit('delete-product', id);
}**/

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

