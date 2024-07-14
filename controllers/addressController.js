const { Address } = require('../models');

// Create a new address
const createAddress = async (req, res) => {
    try {
        const { name, phoneNumber, street, city, state, zip, country } = req.body;
        const userId = req.user ? req.user.id : null; // Use user ID if available, otherwise null
        const address = await Address.create({
            userId,
            name,
            phoneNumber,
            street,
            city,
            state,
            zip,
            country
        });
        res.status(201).json({ message: 'Address created successfully', address });
    } catch (error) {
        res.status(500).json({ error: error.message, message: 'Error creating address' });
    }
};

// Get address by user ID (Admin and Super Admin)
const getAddressByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        const address = await Address.findOne({ where: { userId } });
        if (!address) {
            return res.status(404).json({ message: 'Address not found' });
        }
        res.json(address);
    } catch (error) {
        res.status(500).json({ error: error.message, message: 'Error fetching address' });
    }
};

// Get address for the logged-in user
const getUserAddress = async (req, res) => {
    try {
        const userId = req.user.id;
        const address = await Address.findOne({ where: { userId } });
        if (!address) {
            return res.status(404).json({ message: 'Address not found' });
        }
        res.json(address);
    } catch (error) {
        res.status(500).json({ error: error.message, message: 'Error fetching address' });
    }
};

// Update address
const updateAddress = async (req, res) => {
    try {
        const { name, phoneNumber, street, city, state, zip, country } = req.body;
        const userId = req.user.id;
        const [rowsUpdated, updatedAddress] = await Address.update({
            name,
            phoneNumber,
            street,
            city,
            state,
            zip,
            country
        }, {
            where: { userId },
            returning: true,
            plain: true
        });
        if (rowsUpdated === 0) {
            return res.status(404).json({ message: 'Address not found' });
        }
        res.json({ message: 'Address updated successfully', address: updatedAddress });
    } catch (error) {
        res.status(500).json({ error: error.message, message: 'Error updating address' });
    }
};

module.exports = { createAddress, getAddressByUserId, getUserAddress, updateAddress };
