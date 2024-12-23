const Review = require('../model/review');
const Appointment = require('../model/appointment');
const Staff = require('../model/staff');

const leaveReview = async (req, res) => {
    try {
        const { appointmentId, staffId, rating, comment } = req.body;
        const appointment = await Appointment.findByPk(appointmentId);
        if (!appointment) return res.status(404).json({ error: 'Appointment not found' });

        const review = await Review.create({
            appointmentId,
            staffId,
            rating,
            comment
        });

        res.status(201).json(review);
    } catch (error) {
        console.error('Error leaving review:', error);
        res.status(500).json({ error: 'Error leaving review' });
    }
};

const getReviews = async (req, res) => {
    try {
        const reviews = await Review.findAll({
            include: [
                { model: Appointment, attributes: ['date', 'time'] },
                { model: Staff, attributes: ['name'] }
            ]
        });

        res.status(200).json(reviews);
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ error: 'Error fetching reviews' });
    }
};

const respondToReview = async (req, res) => {
    try {
        const { id } = req.params;
        const { response } = req.body;

        const review = await Review.findByPk(id);
        if (!review) return res.status(404).json({ error: 'Review not found' });

        review.response = response;
        await review.save();

        res.status(200).json(review);
    } catch (error) {
        console.error('Error responding to review:', error);
        res.status(500).json({ error: 'Error responding to review' });
    }
};

module.exports = {
    leaveReview,
    getReviews,
    respondToReview
};