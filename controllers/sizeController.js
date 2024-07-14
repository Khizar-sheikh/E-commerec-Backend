const { Size } = require('../models');

const createSize = async (req, res) => {
    try {
        const { name, abbr, description } = req.body;

        // Validate required fields
        if (!name || !abbr) {
            return res.status(400).json({ message: 'Name and abbreviation are required fields' });
        }

        const newSize = await Size.create({ name, abbr, description });
        res.status(201).json({ message: 'Size created successfully', size: newSize });
    } catch (err) {
        res.status(500).json({ error: err.message, message: 'Internal Server Error' });
    }
};

const getAllSizes = async (req, res) => {
    try {
        const sizes = await Size.findAll();
        res.json(sizes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getSizeById = async (req, res) => {
    try {
        const { id } = req.params;
        const size = await Size.findByPk(id);
        if (!size) {
            return res.status(404).json({ message: 'Size not found' });
        }
        res.json(size);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


const updateSize = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, abbr, description } = req.body;

        // Validate required fields
        if (!name || !abbr) {
            return res.status(400).json({ message: 'Name and abbreviation are required fields' });
        }

        const [updatedRowsCount, [updatedSize]] = await Size.update(
            { name, abbr, description },
            { where: { id }, returning: true, individualHooks: true }
        );

        if (updatedRowsCount === 0) {
            return res.status(404).json({ message: 'Size not found' });
        }

        res.json({ message: 'Size updated successfully', size: updatedSize });
    } catch (err) {
        res.status(500).json({ error: err.message, message: 'Internal Server Error' });
    }
};

const deleteSize = async (req, res) => {
    try {
        const { id } = req.params;
        const size = await Size.findByPk(id);
        if (!size) {
            return res.status(404).json({ message: 'Size not found' });
        }

        await Size.destroy({ where: { id } });

        res.json({ message: 'Size deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    createSize,
    getSizeById,
    updateSize,
    deleteSize,
    getAllSizes
}