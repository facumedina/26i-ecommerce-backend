const mongoose = require('mongoose')
const Schema = mongoose.Schema;


const ProductSchema = new Schema({
    name: { type: String, required: true, minlength: 4, maxlength: 40 },
    detail: { type: String, required: true, maxlength: 250 },
    price: { type: Number,  required: true},
    stock: { type: Boolean, required: true, default: true }, //
    category: { type: String, required: true }
})

module.exports = mongoose.model('Product', ProductSchema)
                               //en mongoDB busca una collecion llamada **users**