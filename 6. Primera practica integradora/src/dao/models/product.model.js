import mongoose from "mongoose";

const productCollection = 'products'

const productSchema = new mongoose.Schema({
    title: { 
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    code: {
        type: String,
        unique: true,
        required: true
    },
    stock: {
        type: String,
        required: true
    },
    thumbnail: {
        type: Array,
        default: []
    }
});

export const productModel = mongoose.model(productCollection, productSchema);