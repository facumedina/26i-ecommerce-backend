const express = require('express');
const api = express.Router();
const productController = require('../controllers/product.controller')

api.get('/products', productController.getProducts);
api.post('/products', productController.createProduct);


module.exports = api