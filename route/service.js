const express = require('express');
const router = express.Router();
const { getAllServices, addService, updateService, deleteService, updateAvailability} = require('../controllers/service');
const { getAllStaffWithServices} = require('../controllers/staff'); 
const { authenticate } = require('../middlewares/authenticate');

router.get('/services', authenticate, getAllServices);
router.get('/staff', authenticate, getAllStaffWithServices);  
router.post('/services', authenticate, addService);
router.put('/services/:id', authenticate, updateService);
router.delete('/services/:id', authenticate, deleteService);
router.put('/services/:id/availability', authenticate, updateAvailability);

module.exports = router;
