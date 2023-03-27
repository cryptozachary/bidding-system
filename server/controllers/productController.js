const ProductModel = require('../models/Products');

module.exports.getProducts = (req, res) => {
    ProductModel.find({}, (err, result) => {
        if (err) {
            res.json(err)
        }
        res.json(result)
    })
}

module.exports.addProduct = async (req, res) => {
    const product = {
        "name": req.body.name,
        "price": req.body.price,
        "description": req.body.description
    }
    // create new user using user model and past the data (user) to the database
    const newProduct = new ProductModel(product)
    try {
        await newProduct.save()
        res.json(product)
        console.log('Product Added!')
    } catch (err) {
        res.json({ message: err });
    }
}

module.exports.updateProduct = async (req, res) => {
    console.log('this is the bid price' + " " + req.body.price + " " + req.params.id)
    try {
        const updatedProduct = await ProductModel.findByIdAndUpdate(req.params.id, {
            "price": req.body.price,
        }, { new: true });
        res.json(updatedProduct);
        console.log('Product Updated!')
    } catch (err) {
        res.json({ message: err });
    }
}

module.exports.deleteProduct = async (req, res) => {
    console.log('you are delting item:' + req.params.id)
    try {
        const productToDelete = await ProductModel.deleteOne({ _id: req.params.id });
        res.json(productToDelete);
        console.log('Product deleted!')
    } catch (err) {
        res.json({ message: err });
    }
}