const express = require('express');
const router = express.Router();
const { leaveReview, getReviews, respondToReview } = require('../controllers/review');
const { authenticate } = require('../middlewares/authenticate');

router.post('/reviews', authenticate, leaveReview);
router.get('/reviews', authenticate, getReviews);
router.put('/reviews/:id/response', authenticate, respondToReview);

module.exports = router;