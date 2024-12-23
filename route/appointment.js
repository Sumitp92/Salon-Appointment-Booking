const express = require('express');
const router = express.Router();
const { getAvailableSlots, bookAppointment, getAppointmentDetails, rescheduleAppointment, cancelAppointment } = require('../controllers/appointment');
const { createPayment , updatePaymentStatus } = require('../controllers/payment');
const { authenticate } = require('../middlewares/authenticate');

router.get('/appointments/slots', authenticate, getAvailableSlots);
router.post('/appointments', authenticate, bookAppointment);
router.get('/appointments', authenticate, getAppointmentDetails);
router.put('/appointments/:id', authenticate, rescheduleAppointment); 
router.delete('/appointments/:id', authenticate, cancelAppointment); 

// below is payment routes
router.post('/appointments/:id/payment', authenticate, createPayment);
router.post('/appointments/:id/payment/status', authenticate, updatePaymentStatus);

module.exports = router;