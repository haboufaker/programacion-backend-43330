import mongoose from "mongoose";

const cartCollection = 'carts'

const cartSchema = new mongoose.Schema({
    products: {
        type: [{product: Number, quantity: { type: Number, default: 0 }}],
        required: true,
        default: []
    }
});

export const cartModel = mongoose.model(cartCollection, cartSchema);