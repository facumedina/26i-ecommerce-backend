const Product = require('../schemas/product.schema');

const getProducts = async(req, res) => {
    try {
        console.log(req.query)
        let searchCriteria = req.query || {};
        
        Object.keys(searchCriteria).forEach(key => {
            searchCriteria[key] = new RegExp(req.query[key], 'i');
        })
    
        console.log(searchCriteria)

        const [ products, total ] = await Promise.all([
            Product.find(searchCriteria),
            Product.find(searchCriteria).countDocuments()
        ])

        return res.status(200).send({
            message: 'Productos obtenidos correctamente',
            products,
            total
        })
        
    } catch (error) {
        console.log(error)
        return res.status(400).send(error)
    }
}

const createProduct = async(req, res) => {
    const newProduct = new Product(req.body)

    const product = await newProduct.save()
    
    return res.send({ product })
}


module.exports = {
    getProducts,
    createProduct
}