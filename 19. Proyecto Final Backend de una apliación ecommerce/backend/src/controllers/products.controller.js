import productService from "../services/product.service.js";
import ProductsPageDTO from "../dto/productsPage.dto.js";
import ProductDTO from "../dto/products.dto.js";
import mockingProductService from "../services/mockingProduct.service.js";
import { generateProduct } from "../utils/generateProduct.js";
import CustomErrors from '../errors/customErrors.js';
import { generateProductErrorInfo } from '../errors/info.js';
import EErrors from '../errors/EErrors.js';
import mongoose from "mongoose";
import enviroment from "../config/enviroment.js";
import nodemailer from 'nodemailer';
import userService from "../services/user.service.js";

const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: enviroment.EMAIL,
        pass: enviroment.EMAIL_PASSWORD,
    },
});


export const getProducts = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || undefined;
		const page = parseInt(req.query.page) || undefined;
		const category = req.query.category;
		const availability = req.query.availability;
		const sort = req.query.sort;

		const products = await productService.getProductsForView(sort, limit, page, category, availability);
		products.category = category;
		products.availability = availability;

		const totalPages = products.totalPages;
		const prevPage = products.prevPage || null;
		const nextPage = products.nextPage || null;
		const currentPage = products.page;
		const hasPrevPage = products.hasPrevPage;
		const hasNextPage = products.hasNextPage;
		const prevLink = prevPage ? `/products?limit=${limit}&page=${prevPage}&sort=${sort}&category=${category}&availability=${availability}` : null;
		const nextLink = nextPage ? `/products?limit=${limit}&page=${nextPage}&sort=${sort}&category=${category}&availability=${availability}` : null;

		const productsPage = new ProductsPageDTO({
			status: 'success',
			payload: products.docs,
			totalPages,
			prevPage,
			nextPage,
			page: currentPage,
			hasPrevPage,
			hasNextPage,
			prevLink,
			nextLink,
		})

		res.status(200).send(productsPage);
    } catch (err) {
		res.status(500).send({Error: "Internal server error"});
	}
};

export const getProductsById = async (req, res) => {
    try {
		let id = req.params.pid
		let existingProduct = await productService.getProductById(id);
		if (existingProduct === null) {
			res.status(404).send({Error: "Not found"})
		} else {
			res.status(201).send({existingProduct});
		}
		return existingProduct
	} catch (err) {
		res.status(500).send({Error: "Internal server error"});
	}
};

export const addProduct = async (req, res) => {
    try {
		let product = req.body

		if (!product.title || !product.description || !product.price || !product.code || !product.stock || !product.category) {
			const error = CustomErrors.createError("Product Creation Error", generateProductErrorInfo(product), "Error while adding product", EErrors.INVALID_TYPE)
			res.status(400).send({error});
		}

		if (req.session.user) {
			const user = req.session.user;
			product.owner = user.email
		} else {
			product.owner = 'admin'
		}

		let newProduct = new ProductDTO(product)

		let addProduct = await productService.addProduct(newProduct)
        if (addProduct === null) {
			res.status(400).send({Error: "Could not add product"})
        } else {
			res.status(201).send({Message: "Product added"})
		}
    } catch (err) {
		req.logger.fatal(err)
		res.status(500).send({Error: err});
	}
};

// update product PUT method
export const updateProduct = async (req, res) => {
    try {
		let id = req.params.pid
		let product = req.body;
		let existingProduct = product;

		let currentUser = req.session.user;

		if (!req.session.user) {
			currentUser = {
				role: "admin",
			};
		}


		let updateProduct = 409;
        if (currentUser.role === 'admin' || (currentUser.role === 'premium' && product.owner.toString() === currentUser._id.toString())) {
			updateProduct = await productService.updateProduct(id, existingProduct)
			res.status(201).send({Message: "Product updated"})
		} else {
			res.status(409).send({Error: "Can't update object property, make sure the property exists, you are not trying to modify the product code with an existing one for another product or you are not trying to modify the object's ID"})
		}
    } catch (err) {
		console.log(err)
		req.logger.fatal(err)
		res.status(500).send({Error: "Internal server error"});
	}
};

export const deleteProduct =async (req, res) => {
    try {
		const productId = req.params.pid;

        const product = await productService.getProductById(productId);

        if (!product) {
            res.status(404).send({ Error: "Not found" });
            return;
        }


		let currentUser = req.session.user;

		if (!req.session.user) {
			currentUser = {
				role: "admin",
			};
		}

        if (currentUser.role === 'admin' || (currentUser.role === 'premium' && product.owner.toString() === currentUser.email.toString())) {
			const user = {
				email: product.owner,
			}
            const productOwner = await userService.findOne(user)
			console.log(`Este es el Owner: ${productOwner}`)
			if (productOwner.role === 'premium') {

				const mailOptions = {
					from: `Coderhouse Test <${enviroment.EMAIL}>`,
					to: productOwner.email,
					subject: 'Product Deleted Notification',
					text: `Dear ${productOwner.first_name},\n\nThis email is to notify that the product: <${productEmail.title}> has been succesfully deleted. \n\nSincerely, The backend ecommerce Team`,
				};

				// Send email
				await transporter.sendMail(mailOptions);
			}
			await productService.deleteProduct(productId);

            res.status(201).send({ Message: "Product deleted" });
        } else {
            res.status(403).send({ Error: "Permission denied" });
        }
    } catch (err) {
		console.log(err)

		req.logger.fatal(err)
		res.status(500).send({Message: "Internal server error"});
	}
};

export const mockingProducts = async (req, res) => {
	try {
		for (let i = 0; i < 100; i++) {
			await mockingProductService.addProduct(generateProduct());
		}

		res.json((await mockingProductService.getProducts()))
    } catch (err) {
		req.logger.fatal(err)
		res.status(500).send({Message: "Internal server error"});
	}
}

export const deleteAll = async (req, res) => {
	try {
		await mockingProductService.deleteAll()

		res.json((await mockingProductService.getProducts()))
    } catch (err) {
		req.logger.fatal(err)
		res.status(500).send({Message: "Internal server error"});
	}
}

export const uploadProductImage = async (req, res) => {
	const productId = req.params.pid;

	try {
		const product = await productService.getProductById(productId);

		if (!product) {
		return res.status(404).json({ error: 'Product not found' });
		}

		const uploadedImage = req.file; // Uploaded image file
		const imageUrl = `/uploads/products/${uploadedImage.filename}`;

		product.thumbnail.push(imageUrl);

		await product.save();
		res.render('login');
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: 'An error occurred while uploading the product image.' });
	}
};