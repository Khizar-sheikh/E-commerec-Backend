const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models');
const crypto = require('crypto')
const Cart = require('../models');
const { body, validationResult } = require('express-validator');
const { sendVerificationEmail, sendForgotEmail } = require('../utils/verifyemail');
const { generateToken } = require('../utils/utils');

// Function to generate a random verification code
const generateVerificationCode = () => {
    const length = 6;
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        code += charset[randomIndex];
    }
    return code;
};

// Function to register a new user and send verification email
const registerUser = async (req, res) => {
    const { username, email, password, phone, firstName, lastName } = req.body;

    try {
        // Check if required fields are provided
        const requiredFields = ['username', 'email', 'password', 'firstName', 'lastName'];
        for (const field of requiredFields) {
            if (!req.body[field]) {
                return res.status(400).json({ error: `Please provide a ${field}` });
            }
        }

        // Check if email is already registered
        let user = await User.findOne({ where: { email } });
        if (user) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Check if username is already taken
        user = await User.findOne({ where: { username } });
        if (user) {
            return res.status(400).json({ error: 'Username already taken' });
        }

        // Validate phone number format
        const phoneRegex = /^(?:\+92)?[\s\d-]{10,14}$/;
        if (phone && !phoneRegex.test(phone)) {
            return res.status(400).json({ error: 'Invalid phone number format' });
        }

        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar) {
            return res.status(400).json({ error: 'Password must contain uppercase, lowercase, number, and special character' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate verification code
        const verificationCode = generateVerificationCode();

        // Create a new user instance with verification code
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
            phone,
            firstName,
            lastName,
            verificationCode: verificationCode
        });

        // Send verification email
        await sendVerificationEmail(email, verificationCode);

        const token = generateToken(newUser);

        // Return success response
        res.status(201).json({ message: 'User registered successfully. Please check your email for verification code.', token });

    } catch (error) {
        // Handle error
        console.error('Error in registering user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const verifyUser = async (req, res) => {
    const { email, verificationCode } = req.body;

    try {
        // Find user with the given email and verification code
        const user = await User.findOne({ where: { email, verificationCode } });

        if (!user) {
            return res.status(400).json({ error: 'Invalid email or verification code' });
        }

        // Update user to set isVerified to true and clear the verification code
        user.isVerified = true;
        user.verificationCode = null;

        await user.save();

        res.status(200).json({ message: 'User verified successfully' });
    } catch (error) {
        console.error('Error in verifying user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const loginUser = async (req, res) => {
    const { email, password, username } = req.body;

    try {
        let user;
        if (email) {
            user = await User.findOne({ where: { email } });
        } else if (username) {
            user = await User.findOne({ where: { username } });
        }

        if (!user || !await bcrypt.compare(password, user.password)) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        if (!user.isVerified) {
            return res.status(400).json({ error: 'Please verify your email first' });
        }

        // Update user role if currently 'guest'
        if (user.role === 'guest') {
            user.role = 'user';
            await user.save();
        }

        const token = generateToken(user);

        res.status(200).json({ message: 'Login successful', token, role: user.role });
    } catch (error) {
        console.error('Error in logging in user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const updateUserRole = async (req, res) => {
    const { email, role } = req.body;

    // Check if the role is valid
    const validRoles = ['user', 'admin', 'superadmin'];
    if (!validRoles.includes(role)) {
        return res.status(400).json({ error: 'Invalid role' });
    }

    try {
        // Find the user by email
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Ensure only superadmin can assign admin or superadmin roles
        if (role === 'admin' || role === 'superadmin') {
            if (req.user.role !== 'superadmin') {
                return res.status(403).json({ error: 'Access denied' });
            }
        }

        // Update the user's role
        user.role = role;
        await user.save();

        res.status(200).json({ message: 'User role updated successfully' });
    } catch (error) {
        console.error('Error in updating user role:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get Current User
const getUserDetails = async (req, res) => {
    try {
        // Extract user ID from authenticated request (assuming you're using JWT for authentication)
        const userId = req.user.id;

        // Fetch the user details including related data using Sequelize associations
        const user = await User.findByPk(userId, {
            include: [
                { model: Address, as: 'addresses' },
                { model: Order, as: 'orders' },
                { model: Review, as: 'reviews' }
            ]
        });

        // Check if user is found
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Fetch user's cart separately
        const cart = await Cart.findOne({ where: { userId }, include: ['items'] });

        // Combine all relevant information into a single response object
        const userDetails = {
            id: user.id,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            phone: user.phone,
            addresses: user.addresses,
            orderHistory: user.orders,
            reviews: user.reviews,
            cart: cart ? cart.items : []
        };

        // Return the combined user details
        res.status(200).json(userDetails);
    } catch (error) {
        console.error('Error in fetching user details:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Update User Profile
const updateUserProfile = async (req, res) => {
    // Validate the updated user data using express-validator
    await body('username')
        .isLength({ min: 3 })
        .withMessage('Username must be at least 3 characters')
        .optional()
        .run(req);

    await body('firstName')
        .isLength({ min: 3 })
        .withMessage('First name must be at least 3 characters')
        .isAlpha()
        .withMessage('First name must only contain letters')
        .optional()
        .run(req);

    await body('lastName')
        .isLength({ min: 3 })
        .withMessage('Last name must be at least 3 characters')
        .isAlpha()
        .withMessage('Last name must only contain letters')
        .optional()
        .run(req);

    await body('phone')
        .matches(/^(?:\+92)?[\s\d-]{10,14}$/)
        .withMessage('Phone number is not valid')
        .optional()
        .run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.user.id;
    const { username, firstName, lastName, phone } = req.body;

    try {
        // Find the user by ID
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if the new username already exists
        if (username) {
            const existingUser = await User.findOne({ where: { username } });
            if (existingUser && existingUser.id !== userId) {
                return res.status(400).json({ error: 'Username already taken' });
            }
            user.username = username;
        }

        // Update the user profile fields (only allowed fields)
        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;
        if (phone) user.phone = phone;

        // Save the updated user data to the database
        await user.save();

        // Return the updated user data
        res.status(200).json({ message: 'User profile updated successfully', user });
    } catch (error) {
        console.error('Error in updating user profile:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Change Password Function
const changePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    try {
        // Check if new password is provided and not equal to old password
        if (!newPassword || newPassword === oldPassword) {
            return res.status(400).json({ error: 'New password must be different from the old password' });
        }

        // Find the user by ID
        const user = await User.findByPk(req.user.id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Compare the old password with the stored hashed password
        const isMatch = await bcrypt.compare(oldPassword, user.password);

        if (!isMatch) {
            return res.status(400).json({ error: 'Incorrect old password' });
        }

        // Additional password checks (length, complexity, etc.)
        if (newPassword.length < 8) {
            return res.status(400).json({ error: 'New password must be at least 8 characters long' });
        }
        const hasUpperCase = /[A-Z]/.test(newPassword);
        const hasLowerCase = /[a-z]/.test(newPassword);
        const hasNumber = /\d/.test(newPassword);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);

        if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar) {
            return res.status(400).json({ error: 'New password must contain uppercase, lowercase, number, and special character' });
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update the password in the database
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
        console.error('Error in changing password:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Function to resend verification code
const resendVerificationCode = async (req, res) => {
    const { email } = req.body;

    try {
        // Check if the email is provided
        if (!email) {
            return res.status(400).json({ error: 'Please provide an email' });
        }

        // Find the user by email
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if user is already verified
        if (user.isVerified) {
            return res.status(400).json({ error: 'User is already verified' });
        }

        // Generate a new verification code
        const newVerificationCode = generateVerificationCode();
        user.verificationCode = newVerificationCode;

        // Save the updated user record
        await user.save();

        // Resend verification email
        await sendVerificationEmail(email, newVerificationCode);

        res.status(200).json({ message: 'Verification code resent successfully. Please check your email.' });
    } catch (error) {
        console.error('Error in resending verification code:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Forgot Password
const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Generate a reset token
        const resetToken = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        await user.save();

        // Send the reset token to the user's email
        const resetURL = `http://${req.headers.host}/reset/${resetToken}`;
        const message = `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n` +
            `Please click on the following link, or paste this into your browser to complete the process:\n\n` +
            `${resetURL}\n\n` +
            `If you did not request this, please ignore this email and your password will remain unchanged.\n`;

        await sendForgotEmail(user.email, 'Password Reset', message);

        res.status(200).json({ message: 'Password reset email sent successfully' });
    } catch (error) {
        console.error('Error in sending password reset email:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

//Check If Admin
const checkIfAdmin = async (req, res, next) => {
    try {
        // Extract the token from the Authorization header
        const token = req.header('Authorization').replace('Bearer ', '');

        // Verify the token and decode the payload
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find the user by ID
        const user = await User.findByPk(decoded.id);

        if (!user) {
            throw new Error('User not found');
        }

        // Check if user is an admin
        if (user.role !== 'admin' && user.role !== 'superadmin') {
            throw new Error('User is not authorized as admin');
        }

        // Set user information in the request object if needed
        req.user = user;

        // Call next middleware
        next();
    } catch (error) {
        console.error('Error in checking admin:', error);
        res.status(401).json({ error: 'Unauthorized' });
    }
};

const listUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (error) {
        console.error('Error listing users:', error);
        res.status(500).json({ error: 'Failed to list users' });
    }
};

const getUserById = async (req, res) => {
    const userId = req.params.userId;
    try {
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error('Error fetching user details:', error);
        res.status(500).json({ error: 'Failed to fetch user details' });
    }
};

module.exports = {
    registerUser,
    verifyUser,
    loginUser,
    updateUserRole,
    getUserDetails,
    updateUserProfile,
    changePassword,
    forgotPassword,
    checkIfAdmin,
    listUsers,
    getUserById,
    resendVerificationCode
};