import { Router } from "express";
import { productsController, cartController } from "../utils/instances.js";
import cartService from "../dao/service/cart.service.js";
import productService from "../dao/service/product.service.js";
import { cartModel } from "../dao/models/cart.model.js";
import mongoose from "mongoose";


// Route creation
const cartsRouter = Router();

// add cart POST method
cartsRouter.post('/', async (req, res) => {
    try {
        const newCart = await cartService.addCart()

		//sessionStorage.setItem("cartId", JSON.stringify(newCart._id));

		res.status(201).send({ cartId: newCart._id });
    } catch (err) {
		res.status(500).send({Error: "Internal server error"});
	}
});

// return cart products by id GET method
cartsRouter.get('/:cid', async (req, res) => {
    try {
		const cartId = req.params.cid;
		const cart = await cartModel.findById(cartId).populate('products.product');
	
		if (!cart) {
		  res.status(404).send({ Error: "Cart not found" });
		} else {
		  res.status(200).send({ cart });
		}
	} catch (err) {
		res.status(500).send({Error: "Internal server error"});
	}
});

// add product to cart POST method
cartsRouter.post('/:cid/products/:pid', async (req, res) => {
    try {
		let cartId = req.params.cid;
		let productId = req.params.pid;

        let existingCartProducts = await cartService.addProductById(cartId, productId);

        if (existingCartProducts === 404) {
            res.status(404).send({ Error: "Not found" });
        } else {
            res.status(201).send({ Message: "Cart updated" });
        }
	} catch (err) {
		res.status(500).send({Error: "Internal server error"});
	}
});

//Delete product from cart DELETE method
cartsRouter.delete('/:cid/products/:pid', async (req, res) => {
    try {
		const { cid, pid } = req.params;
		const cartId = cid;
		const productId = pid;
	
		const cart = await cartModel.findById(cartId);
	
		if (!cart) {
		  return res.status(404).send({ Error: "Cart not found" });
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
});

// update cart products PUT method
cartsRouter.put('/:cid', async (req, res) => {
	try {
	  const { cid } = req.params;
	  const { products } = req.body;
  
	  const cart = await cartModel.findById(cid);
  
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
});

// Update product quantity in cart PUT method
cartsRouter.put('/:cid/products/:pid', async (req, res) => {
    try {
		const { cid, pid } = req.params;
		const { quantity } = req.body;
	
		const cart = await cartModel.findById(cid);
	
		if (!cart) {
		  return res.status(404).send({ Error: "Cart not found" });
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
});

// delete all cart products DELETE method
cartsRouter.delete('/:cid', async (req, res) => {
    try {
		let id = req.params.cid

        const cart = await cartModel.findByIdAndUpdate(id, { products: [] }, { new: true });

		let result = await cartModel.updateOne({_id: id}, cart)

		res.status(201).send({Message: "cart products updated"})
    } catch (err) {
		res.status(500).send({Error: "Internal server error"});
	}
});
// Route export
export { cartsRouter };