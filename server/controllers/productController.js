const ProductModel = require('../models/Products');

module.exports.getProducts = async (req, res) => {
    try {
        const products = await ProductModel.find({ userId: req.user._id });
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports.addProduct = async (req, res) => {
    const product = {
        userId: req.user._id,  // Associate the product with the current user
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        imgFile: req.body.file,
    };

    const newProduct = new ProductModel(product);
    try {
        await newProduct.save();
        res.status(201).json(newProduct);
        console.log('Product Added!');
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

module.exports.updateProduct = async (req, res) => {
    try {
        const product = await ProductModel.findOne({ _id: req.params.id, userId: req.user._id });
        if (!product) {
            return res.status(404).json({ message: "Product not found or you don't have permission to update it" });
        }

        product.price = req.body.price;
        const updatedProduct = await product.save();

        res.json(updatedProduct);
        console.log('Product Updated!');
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

module.exports.deleteProduct = async (req, res) => {
    try {
        const result = await ProductModel.deleteOne({ _id: req.params.id, userId: req.user._id });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "Product not found or you don't have permission to delete it" });
        }
        res.json({ message: 'Product deleted!' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};