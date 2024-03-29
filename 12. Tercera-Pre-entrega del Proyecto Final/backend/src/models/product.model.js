import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2"

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
        required: true,
        index: true
    },
    code: {
        type: String,
        unique: true,
        required: true
    },
    stock: {
        type: Number,
        required: true,
        index: true
    },
    thumbnail: {
        type: Array,
        default: []
    },
    category: {
        type: String,
        required: true
    },
    availability: {
        type: Boolean,
        required: true,
        default: true
    }
});
productSchema.plugin(mongoosePaginate)

export const productModel = mongoose.model(productCollection, productSchema);