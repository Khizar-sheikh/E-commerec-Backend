const { Product, ProductVariant, Size } = require('../models'); // Adjust model imports as necessary

const createProductVariant = async (req, res) => {
    try {
        const { productId, sizeId, stock, sku } = req.body;

        // Validate required fields
        if (!productId || !sizeId || !sku) {
            return res.status(400).json({ message: 'Product, size, and SKU are required fields' });
        }

        // Check if SKU already exists
        const existingVariant = await ProductVariant.findOne({ where: { sku } });
        if (existingVariant) {
            return res.status(400).json({ message: 'SKU already exists' });
        }

        // Create the product variant
        const productVariant = await ProductVariant.create({ productId, sizeId, stock, sku });

        // Optionally, add the variant to the product's variants array
        const parentProduct = await Product.findByPk(productId);
        if (!parentProduct) {
            return res.status(404).json({ message: 'Parent product not found' });
        }

        res.status(201).json({ message: 'Product variant created successfully', code: 200, productVariant });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const getVariantsByProductId = async (req, res) => {
    try {
        const { productId } = req.params;
        const variants = await ProductVariant.findAll({
            where: { productId },
            include: Size
        });
        res.json(variants);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getProductVariantById = async (req, res) => {
    try {
        const { id } = req.params;
        const productVariant = await ProductVariant.findByPk(id, {
            include: Size
        });
        if (!productVariant) {
            return res.status(404).json({ message: 'Product variant not found' });
        }
        res.json(productVariant);
    } catch (err) {
        res.status(500).json({ error: err.message, message: 'Internal Server Error' });
    }
};


const updateProductVariant = async (req, res) => {
    try {
        const { id } = req.params;
        const { sizeId, stock, sku } = req.body;

        // Check if SKU already exists and belongs to a different variant
        const existingVariant = await ProductVariant.findOne({ where: { sku } });
        if (existingVariant && existingVariant.id !== parseInt(id, 10)) {
            return res.status(400).json({ message: 'SKU already exists' });
        }

        const [updatedRowsCount, [updatedProductVariant]] = await ProductVariant.update(
            { sizeId, stock, sku },
            { where: { id }, returning: true, individualHooks: true }
        );

        if (updatedRowsCount === 0) {
            return res.status(404).json({ message: 'Product variant not found' });
        }

        res.json({ message: 'Product variant updated successfully', productVariant: updatedProductVariant });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const deleteProductVariant = async (req, res) => {
    try {
        const { id } = req.params;
        const productVariant = await ProductVariant.findByPk(id);
        if (!productVariant) {
            return res.status(404).json({ message: 'Product variant not found' });
        }

        await ProductVariant.destroy({ where: { id } });

        res.json({ message: 'Product variant deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    createProductVariant,
    getProductVariantById,
    getVariantsByProductId,
    deleteProductVariant,
    updateProductVariant
}