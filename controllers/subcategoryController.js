const { SubCategory, Category } = require('../models');

const createSubCategory = async (req, res) => {
    try {
        const { name, description, categoryId } = req.body;

        // Validate required fields
        if (!name || !categoryId) {
            return res.status(400).json({ message: 'Name and categoryId are required fields' });
        }

        // Check if category exists
        const category = await Category.findByPk(categoryId);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        // Check if subcategory already exists in the category
        const existingSubCategory = await SubCategory.findOne({ where: { name, categoryId } });
        if (existingSubCategory) {
            return res.status(400).json({ message: 'SubCategory name already exists in this category.' });
        }

        // Create subcategory
        const newSubCategory = await SubCategory.create({ name, description, categoryId });

        // Add subcategory to category
        await category.addSubCategory(newSubCategory);

        res.status(201).json({ message: 'SubCategory created successfully', subCategory: newSubCategory });
    } catch (error) {
        res.status(500).json({ error: error.message, message: 'Internal Server Error' });
    }
};

const getAllSubCategories = async (req, res) => {
    try {
        const subCategories = await SubCategory.findAll({ include: [{ model: Category }] });
        res.json(subCategories);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getSubCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const subCategory = await SubCategory.findByPk(id, { include: [{ model: Category }] });
        if (!subCategory) {
            return res.status(404).json({ message: 'SubCategory not found' });
        }
        res.json(subCategory);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;

        // Validate required fields
        if (!name) {
            return res.status(400).json({ message: 'Name is a required field' });
        }

        // Find category by ID
        const category = await Category.findByPk(id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }


        // Update category details
        category.name = name;
        category.description = description;
        await category.save();

        // Fetch updated category with associated subcategories
        const updatedCategory = await Category.findByPk(id, { include: [{ model: SubCategory }] });

        res.json(updatedCategory);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    createSubCategory,
    updateCategory,
    getAllSubCategories,
    getSubCategoryById
}

