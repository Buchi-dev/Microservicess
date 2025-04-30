const express = require('express');
const { getProfile, updateProfile, getUsers } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Protect all routes after this middleware
router.use(protect);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);

// Admin routes
router.use(authorize('admin'));
router.get('/', getUsers);

module.exports = router; 