const express = require('express');
const router = express.Router();
const { registerUser, verifyUser, loginUser, updateUserRole, getUserDetails, updateUserProfile, changePassword, forgotPassword, checkIfAdmin, listUsers, getUserById, resendVerificationCode } = require('../controllers/authController'); // Import your register user function
const { authenticate, authorize } = require('../middleware/authmiddleware');

router.post('/register', registerUser);
router.post('/verify', verifyUser);
router.post('/login' , loginUser)
router.get('/user', authenticate, getUserDetails);
router.put('/update-profile' , authenticate , updateUserProfile )
router.post('/change-password' , authenticate , changePassword )
router.post('/forgot-password'  , forgotPassword ) //Will Work on this when we start working in frontend and on this part
router.post('/resend-verification' , authenticate , resendVerificationCode)

router.get('/admin/dashboard', checkIfAdmin, (req, res) => {

    res.json({ message: 'Admin Dashboard accessed successfully', user: req.user });
});

router.post('/update-role', authenticate, authorize(['superadmin']), updateUserRole);
router.get('/users/:userId', authenticate, authorize(['admin', 'superadmin']), getUserById);
router.get('/users', authenticate, authorize(['admin', 'superadmin']), listUsers);

router.get('/admin', authenticate, authorize(['admin']), (req, res) => {
    res.status(200).json({ message: 'Welcome, admin' });
});

module.exports = router;
