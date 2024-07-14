const Collection = require('../models');
const SubCategory = require('../models');

// Create Collection
const createCollection = async (req, res) => {
    try {
        const { name, description, subCategoryId } = req.body;

        // Check if subCategory exists
        const subCategory = await SubCategory.findByPk(subCategoryId);
        if (!subCategory) {
            return res.status(404).json({ message: 'SubCategory not found' });
        }

        // Check if collection name already exists in subCategory
        const existingCollection = await Collection.findOne({ where: { name, subCategoryId } });
        if (existingCollection) {
            return res.status(400).json({ error: 'Collection name already exists in this subcategory.' });
        }

        // Create new collection
        const newCollection = await Collection.create({ name, description, subCategoryId });

        // Add collection to subCategory's collections association
        await subCategory.addCollection(newCollection);

        res.status(201).json({ message: "Collection Created Successfully", collection: newCollection });
    } catch (error) {
        res.status(500).json({ error: error.message, message: "Internal Server Error" });
    }
};

// Get All Collections
const getAllCollections = async (req, res) => {
    try {
        const collections = await Collection.findAll({ include: [{ model: SubCategory, include: 'products' }] });
        res.json(collections);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get Collection by ID
const getCollectionById = async (req, res) => {
    try {
        const { id } = req.params;
        const collection = await Collection.findByPk(id, { include: [{ model: SubCategory, include: 'products' }] });
        if (!collection) {
            return res.status(404).json({ message: 'Collection not found' });
        }
        res.json(collection);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update Collection
const updateCollection = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, subCategoryId } = req.body;

        // Find collection by ID
        const collection = await Collection.findByPk(id);
        if (!collection) {
            return res.status(404).json({ message: 'Collection not found' });
        }

        // If subCategory changes, update associations
        if (collection.subCategoryId !== subCategoryId) {
            // Remove collection from previous subCategory
            const previousSubCategory = await SubCategory.findByPk(collection.subCategoryId);
            if (previousSubCategory) {
                await previousSubCategory.removeCollection(collection);
            }

            // Add collection to new subCategory
            const newSubCategory = await SubCategory.findByPk(subCategoryId);
            if (!newSubCategory) {
                return res.status(404).json({ message: 'New subcategory not found' });
            }
            await newSubCategory.addCollection(collection);

            collection.subCategoryId = subCategoryId;
        }

        // Update collection details
        collection.name = name;
        collection.description = description;
        await collection.save();

        res.json(collection);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete Collection
const deleteCollection = async (req, res) => {
    try {
        const { id } = req.params;

        // Find collection by ID
        const collection = await Collection.findByPk(id);
        if (!collection) {
            return res.status(404).json({ message: 'Collection not found' });
        }

        // Remove collection from associated subCategory
        const subCategory = await SubCategory.findByPk(collection.subCategoryId);
        if (subCategory) {
            await subCategory.removeCollection(collection);
        }

        // Delete collection
        await collection.destroy();

        res.json({ message: 'Collection deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    createCollection,
    getAllCollections,
    getCollectionById,
    updateCollection,
    deleteCollection
};
