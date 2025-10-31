const productService = require('../services/productService');

const getAll = async (req, res) => {
    try {
        // req.query sẽ chứa các tham số filter như ?category=...
        const products = await productService.getAllProducts(req.query);
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getById = async (req, res) => {
    try {
        const product = await productService.getProductById(req.params.id);
        res.status(200).json(product);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
};

const create = async (req, res) => {
    try {
        const product = await productService.createProduct(req.body);
        res.status(201).json({ message: 'Tạo sản phẩm thành công!', product });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const update = async (req, res) => {
    try {
        const product = await productService.updateProduct(req.params.id, req.body);
        res.status(200).json({ message: 'Cập nhật sản phẩm thành công!', product });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const remove = async (req, res) => {
    try {
        const result = await productService.deleteProduct(req.params.id);
        res.status(200).json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

module.exports = {
    getAll,
    getById,
    create,
    update,
    remove,
};