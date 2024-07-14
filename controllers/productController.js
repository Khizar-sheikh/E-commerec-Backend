const Product = require('../models');
const Collection = require('../models')

// Create Product
const createProduct = async (req, res) => {
    try {
        const { name, description, price, collection, images, variants, isFeatured } = req.body;

        // Validate required fields
        if (!name || !price || !collection) {
            return res.status(400).json({ message: "Name, price, and collection are required fields" });
        }

        // Check if the collection exists
        const parentCollection = await Collection.findById(collection);
        if (!parentCollection) {
            return res.status(404).json({ message: 'Collection not found' });
        }

        // Create the new product
        const newProduct = new Product({ name, description, price, collection, images, variants, isFeatured });
        await newProduct.save();

        // Add the product to the collection's products array
        parentCollection.products.push(newProduct._id);
        await parentCollection.save();

        res.status(201).json({ ...newProduct.toObject(), message: "Product Created Successfully", code: 200 });
    } catch (error) {
        res.status(500).json({ error: error.message, message: "Internal Server Error" });
    }
};

const getProductsByCategory = async (req, res) => {
    const { categoryId } = req.params;
    try {
        const products = await Product.find({ 'collection.subCategory.category': categoryId })
            .populate('variants')
            .populate('reviews');
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: `Failed to fetch products by category: ${error.message}` });
    }
};

// Get products by collection
const getProductsByCollection = async (req, res) => {
    const { collectionId } = req.params;
    try {
        const products = await Product.find({ collection: collectionId })
            .populate('variants')
            .populate('reviews');
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: `Failed to fetch products by collection: ${error.message}` });
    }
};

// Get products by subcategory
const getProductsBySubcategory = async (req, res) => {
    const { subcategoryId } = req.params;
    try {
        const products = await Product.find({ 'collection.subCategory': subcategoryId })
            .populate('variants')
            .populate('reviews');
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: `Failed to fetch products by subcategory: ${error.message}` });
    }
};

// Get All Products with pagination, search, and sorting
const getAllProducts = async (req, res) => {
    try {
        const { page = 1, limit = 16, sortBy = 'createdAt', order = 'desc', name, sku, category } = req.query;

        let where = {};
        if (name) where.name = { [Op.iLike]: `%${name}%` };
        if (sku) where.sku = { [Op.iLike]: `%${sku}%` };
        if (category) where['$Collection.SubCategory.Category.id$'] = category;

        let orderQuery;
        switch (sortBy) {
            case 'price':
                orderQuery = [['price', order]];
                break;
            case 'soldCount':
                orderQuery = [['soldCount', order]];
                break;
            case 'createdAt':
                orderQuery = [['createdAt', order]];
                break;
            case 'isFeatured':
                orderQuery = [['isFeatured', 'DESC']];
                break;
            default:
                orderQuery = [['createdAt', order]];
                break;
        }

        const { count: totalProducts, rows: products } = await Product.findAndCountAll({
            where,
            order: orderQuery,
            limit: parseInt(limit, 10),
            offset: (page - 1) * limit,
            include: [
                {
                    model: Collection,
                    include: {
                        model: SubCategory,
                        include: Category
                    }
                },
                {
                    model: ProductVariant,
                    include: Size
                },
                Review
            ]
        });

        res.json({
            products,
            currentPage: page,
            totalPages: Math.ceil(totalProducts / limit),
            totalProducts
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get Product by ID
const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByPk(id, {
            include: [
                {
                    model: Collection,
                    include: {
                        model: SubCategory,
                        include: Category
                    }
                },
                {
                    model: ProductVariant,
                    include: Size
                },
                Review
            ]
        });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update Product
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;

        const [updatedRowsCount, [updatedProduct]] = await Product.update(updatedData, {
            where: { id },
            returning: true
        });

        if (updatedRowsCount === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json(updatedProduct);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete Product
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedRowsCount = await Product.destroy({ where: { id } });
        if (deletedRowsCount === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ message: 'Product deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    getProductsByCategory,
    getProductsByCollection,
    getProductsBySubcategory
};
