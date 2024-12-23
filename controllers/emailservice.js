const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    secure: false,
    auth: {
        user: '80b7ab001@smtp-brevo.com',
        pass: process.env.EMAIL_API_KEY,
    },
});

const sendBookingConfirmation = async (email, appointmentDetails) => {
    const { id ,  date, time, customerName, staffId, serviceId } = appointmentDetails;
    const message = `
        Dear ${customerName},

        Your appointment has been successfully booked.
        Appointment ID: ${id}
        Date: ${date}
        Time: ${time}
        Staff ID: ${staffId}
        Service ID: ${serviceId}

        Thank you for choosing our sumit salon.

        Best regards,
        Salon Team
    `;

    try {
        await transporter.sendMail({
            from: 'sumitpatil2062003@gmail.com',
            to: email,
            subject: 'Appointment Confirmation',
            text: message,
        });
    } catch (error) {
        console.error('Error sending confirmation email:', error);
        throw new Error('Failed to send confirmation email');
    }
};

const sendAppointmentReminder = async (email, appointmentDetails) => {
    const { date, time, customerName, staffId, serviceId } = appointmentDetails;
    const message = `
        Dear ${customerName},

        This is a reminder for your upcoming appointment.

        Date: ${date}
        Time: ${time}
        Staff ID: ${staffId}
        Service ID: ${serviceId}

        Thank you for choosing our salon.

        Best regards,
        Salon Team
    `;

    try {
        await transporter.sendMail({
            from: 'sumitpatil2062003@gmail.com',
            to: email,
            subject: 'Appointment Reminder',
            text: message,
        });
    } catch (error) {
        console.error('Error sending reminder email:', error);
        throw new Error('Failed to send reminder email');
    }
};


module.exports = { sendBookingConfirmation , sendAppointmentReminder };