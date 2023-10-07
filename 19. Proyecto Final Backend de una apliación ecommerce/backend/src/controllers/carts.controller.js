import cartService from "../services/cart.service.js";
import userService from '../services/user.service.js';
import productService from "../services/product.service.js";
import ticketService from "../services/ticket.service.js";
import enviroment from "../config/enviroment.js";
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: enviroment.EMAIL,
        pass: enviroment.EMAIL_PASSWORD,
    },
});

export const addCart = async (req, res) => {
    try {
        const newCart = await cartService.addCart()

		res.status(201).send({ cartId: newCart._id });
    } catch (err) {
		res.status(500).send({Error: "Internal server error"});
	}
};

export const getCartProducts = async (req, res) => {
    try {
		const cartId = req.params.cid;
		const cart = await cartService.findById(cartId);
	
		if (!cart) {
		  res.status(404).send({ Error: "Cart not found" });
		} else {
		  res.status(200).send({ cart });
		}
	} catch (err) {
		res.status(500).send({Error: "Internal server error"});
	}
};

export const addProductToCart = async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        let currentUser = req.session.user;

		if (!req.session.user) {
			currentUser = {
				role: 'admin',
			}
		};

        const existingCartProducts = await cartService.getCartProductsById(cartId)
        const productToAdd = await productService.getProductById(productId);

        if (!productToAdd) {
            return res.status(404).send({ Error: "Product not found" });
        }

        if (currentUser.role === "premium" && productToAdd.owner === currentUser.email) {
            return res.status(403).send({ Error: "Premium users cannot add their own products to the cart" });
        }

        const updatedCartProducts = await cartService.addProductById(cartId, productId)

        if (updatedCartProducts === 404) {
            return res.status(404).send({ Error: "Not found" });
        }

        res.status(201).send({ Message: "Cart updated" });
    } catch (err) {
        console.error(err);
        res.status(500).send({ Error: "Internal server error" });
    }
};


export const deleteProductFromCart = async (req, res) => {
    try {
		const { cid, pid } = req.params;
		const cartId = cid;
		const productId = pid;
	
		const cart = await cartService.findById(cartId);
	
		if (!cart) {
		  return res.status(403).send({ Error: "Cart not found" });
		}
		const productIndex = cart.products.findIndex(p => p.product.toString() === productId);

		if (productIndex === -1) {
		  return res.status(404).send({ Error: "Product not found in cart" });
		}
	
		cart.products.splice(productIndex, 1);
	
		await cart.save();
	
		res.status(200).send({ Message: "Product removed from cart" })
    } catch (err) {
		res.status(500).send({Error: "Internal server error"});
	}
};

export const updateCartProducts = async (req, res) => {
	try {
	  const { cid } = req.params;
	  const { products } = req.body;
  
	  const cart = await cartService.findById(cid);
  
	  if (!cart) {
		return res.status(404).send({ Error: "Cart not found" });
	  }
  
	  // Map the product IDs from the request body to an array of objects
	  const updatedProducts = products.map((product) => {
		// Extract the _id value from the product object
		const productId = product.product._id;
  
		// Exclude the __v property from the product object
		const { __v, ...productData } = product.product;
  
		return {
		  product: productId,
		  quantity: 0,
		};
	  });
  
	  cart.products = updatedProducts;
	  await cart.save();
  
	  res.status(200).send({ Message: "Cart updated" });
	} catch (err) {
	  console.error(err);
	  res.status(500).send({ Error: "Internal server error" });
	}
};

export const updateProductQuantity = async (req, res) => {
    try {
		const { cid, pid } = req.params;
		const { quantity } = req.body;
	
		const cart = await cartService.findById(cid);
	
		if (!cart) {
		  return res.status(403).send({ Error: "Cart not found" });
		}

		const productIndex = cart.products.findIndex(item => item.product && item.product.toString() === pid);
	
		if (productIndex === -1) {
		  return res.status(404).send({ Error: "Product not found in cart" });
		}
	
		cart.products[productIndex].quantity = quantity;
		await cart.save();
	
		res.status(200).send({ Message: "Quantity updated" });
    } catch (err) {
		console.error(err);
		res.status(500).send({Error: "Internal server error"});
	}
};

export const deleteAllCartProducts = async (req, res) => {
    try {
		let id = req.params.cid

        const cart = await cartService.findByIdAndUpdate(id);

		let result = await cartService.updateOne(id, cart)

		res.status(201).send({Message: "cart products updated"})
    } catch (err) {
		res.status(500).send({Error: "Internal server error"});
	}
};

export const purchase = async (req, res) => {
    try {
		const { cid } = req.params;
        const { uid } = req.body; // Access the userId from the request body

        const getUserById = await userService.getUserById(uid);
        const getCart = await cartService.findById(cid);

		if (!getUserById) {
			return res.status(403).send({Error: "User Not found"});
		}

		if (!getCart) {
			return res.status(404).send({Error: "Cart Not found"});
		}

		const getCartProducts = await cartService.getCartProductsById(cid);

		if (getCartProducts == [] || getCartProducts === null) {
			res.status(405).send({Message: "There are no products in this cart"});
		}

		let amount = 0;
		let order = [];
		let preTicketProducts = [];

		for await (const product of getCartProducts) {
			const productInStock = await productService.getProductById(product.product._id)

			preTicketProducts.push(productInStock);

			if (product.quantity > productInStock.stock) {

				req.logger.warning("There's not enough stock for your purchase")

			} else {

				const orderquantity = product.quantity;

				const productUpdater =  {stock: (productInStock.stock - orderquantity)};
				 
				amount = amount + orderquantity * productInStock.price;

				req.logger.debug(`Estos son los productos en estock ${productInStock}`)

				const updatedProduct = await productService.updateProduct(productInStock._id, productUpdater)

				await productInStock.save();

				const productIndex = getCart.products.findIndex(p => p.product._id === productInStock._id);

				order.push(product);

				getCart.products.splice(productIndex, 1);
	
				await getCart.save();

			}
		}

		req.logger.debug("preTicketProducts:", preTicketProducts);


		const code = `${Date.now() + Math.floor(Math.random() * 10000+1)}`;
		const preTicket = {
			code: code,
			amount: amount,
			purchase_datetime: new Date(),
			purchaser: getUserById.email,
		}

		const ticket = await ticketService.createTicket(preTicket);
		
		const resolvedTicket = await ticketService.getTicketById(ticket._id)

		if (!resolvedTicket) {
			req.logger.error("Order could not be completed")

			order.forEach(product => {
				getCart.push(product)
			})

			await getCart.save();

			for await (const product of preTicketProducts) {

				const updateProduct = await productService.updateProduct(product._id, {stock: product.stock})

			}

			await updateProduct.save();


			return res.status(501).json({ status: "error", payload: order });
		}

		fetch(`http://localhost:${enviroment.PORT}/api/carts/mail/${resolvedTicket._id}`, {
			method: "GET",
		})

		res.status(201).send({Message: "Order Processed"})
    } catch (err) {
		console.error(err);
    	res.status(500).json({ Error: "Internal server error" })
	}
};

export const mail = async (req, res) => {
    
	const tid = req.params.tid;
	const ticket = await ticketService.getTicketById(tid)
	const user = await userService.getByEmail(ticket.purchaser)
	const mailOptions = {
        from: `Coderhouse Test <${enviroment.EMAIL}>`,
        to: ticket.purchaser,
        subject: 'Thank you for your purchase!',
        html: `<h1>Hey ${user.first_name}! Your order #${ticket.code} has been succesfully placed for a total amount of $${ticket.amount} on ${ticket.purchase_datetime}</h1>`,
        attachments: [],
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            req.logger.error(error);
        }
        req.logger.info('Email sent: ' + info.response);
    });

    res.send('Sent');
}
