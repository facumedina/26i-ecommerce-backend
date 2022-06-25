const express = require('express')
const app = express();
const cors = require('cors')

const user_routes = require('./routes/user.routes');
const product_routes = require('./routes/product.routes')
const order_routes = require('./routes/order.routes')

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/', (req, res) => {
    //el metodo get es para pedir data.
    return res.send('Ruta principal de mi servidor NODEMON')
})

app.use('/api', [
    user_routes,
    product_routes,
    order_routes
])

module.exports = app;