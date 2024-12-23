const express = require('express');
const router = express.Router();
const { getAllStaff, addStaff, assignService } = require('../controllers/staff');
const { authenticate } = require('../middlewares/authenticate');

router.get('/staff', authenticate, getAllStaff);
router.post('/staff', authenticate, addStaff);
router.post('/staff/assign-service', authenticate, assignService);

module.exports = router;
