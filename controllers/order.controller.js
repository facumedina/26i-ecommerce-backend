const Order = require('../schemas/order.schema');

async function createOrder(req, res) {
    try {
        let order = new Order(req.body);
        const newOrder = await order.save();
        return res.status(200).send({
            ok: true,
            message: 'Orden creada correctamente',
            order: newOrder
        })
    } catch (error) {
        return res.status(500).send({
            ok: false,
            message: `No se pudo crear la orden`
        })
    }
}

async function getOrders(req, res) {
    try {
        const orders = await Order.find().populate('user', {password: 0}).populate('products.productId', '_id name detail');
        return res.status(200).send({
            ok: true,
            message: `Ordenes obtenidas correctamente`,
            orders
        })
        
    } catch (error) {
        return res.status(500).send({
            ok: false,
            message: `No se pudiero obtener las ordenes`
        })
    }

}

module.exports = {
    createOrder,
    getOrders
}