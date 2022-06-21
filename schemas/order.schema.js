const mongoose = require('mongoose')
const Schema = mongoose.Schema;


const OrderSchema = new Schema({
    products: [
        {
            productId: {type: String, ref: 'Product'},
            quantity: Number,
            price: Number
        }
    ],
    user: { type: Object, ref: 'User', required: true},
    createdAt: { type: Date, default: Date.now, required: true }
})

module.exports = mongoose.model('Order', OrderSchema)
                               //en mongoDB busca una collecion llamada **users**