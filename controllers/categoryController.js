const Category = require('../models/Category');
const SubCategory = require('../models/SubCategory');

// Create a new category
const createCategory = async (req, res) => {
    try {
        const { name, description, carouselImages } = req.body;
        
        // Check if category name already exists (case-insensitive)
        const existingCategory = await Category.findOne({ where: { name: { [Sequelize.Op.iLike]: name } } });
        if (existingCategory) {
            return res.status(400).json({ error: 'Category name already exists.' });
        }

        // Create new category
        const category = await Category.create({ name, description, carouselImages });
        res.status(201).json(category);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get all categories
const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.findAll({ include: SubCategory });
        res.json(categories);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get category by ID
const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findByPk(id, { include: SubCategory });
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.json(category);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update category
const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;
        const category = await Category.findByPk(id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        await category.update({ name, description });
        res.json(category);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete category
const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findByPk(id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        await category.destroy();
        res.json({ message: 'Category deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
};
