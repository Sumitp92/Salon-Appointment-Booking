document.getElementById('signupform')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name')?.value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const password = document.getElementById('password').value;

    if (!name || !email || !phone || !password) {
        alert('All fields are required');
        return;
    }

    try {
        const response = await axios.post('http://65.0.45.199:3000/api/signup', { name, email, phone, password });

        if (response.data.success) {
            alert('Signup Successful');
            window.location.href = 'login.html';
        } else {
            alert(response.data.message);
        }
    } catch (err) {
        console.log('Error During Signup', err);
        alert('Signup Failed');
    }
});

document.getElementById('loginform')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!email || !password) {
        alert('Email and password are required');
        return;
    }

    try {
        const response = await axios.post('http://65.0.45.199:3000/api/login', { email, password });

        if (response.data.success) {
            localStorage.setItem('authToken', response.data.token);
            localStorage.setItem('username', response.data.user.name);
            localStorage.setItem('userEmail', email); // Store the user's email
            alert('User Login Successfully');
            window.location.href = 'dashboard.html';
        } else {
            alert(response.data.message);
        }
    } catch (err) {
        console.log('Error in Login', err);
        alert('User Login Failed');
    }
});

// Switch to Signup page from Login page
document.getElementById('newUserBtn')?.addEventListener('click', () => {
    window.location.href = 'signup.html';
});

// Switch to Login page from Signup page
document.getElementById('loginBtn')?.addEventListener('click', () => {
    window.location.href = 'login.html';
});

document.addEventListener('DOMContentLoaded', () => {
    const userEmail = localStorage.getItem('userEmail');
    const isAdmin = userEmail === 'admin@gmail.com';

    if (!isAdmin) {
        document.getElementById('respondToReviewForm').style.display = 'none';
        document.getElementById('addServiceContainer').style.display = 'none';
        document.getElementById('addStaffContainer').style.display = 'none';
        document.getElementById('assignServiceContainer').style.display = 'none';
    }
}
);

document.addEventListener('DOMContentLoaded', () => {
    const fetchServices = async () => {
        const token = localStorage.getItem('authToken');
        try {
            const response = await axios.get('http://65.0.45.199:3000/api/services', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const services = response.data;
            const servicesDiv = document.getElementById('services');
            servicesDiv.innerHTML = '';
            services.forEach(service => {
                const serviceDiv = document.createElement('div');
                serviceDiv.innerHTML = `
                    <h3>${service.name}</h3>
                    <p>${service.description}</p>
                    <p>Id: ${service.id}</p>
                    <p>Duration: ${service.duration} Hours</p>
                    <p>Price:RS ${service.price}</p>
                    <p>Availability: ${service.availability}</p>
                `;
                servicesDiv.appendChild(serviceDiv);
            });
        } catch (error) {
            console.error('Error fetching services:', error);
        }
    };

   
    const fetchStaffWithServices = async () => {
        const token = localStorage.getItem('authToken');
        try {
            const response = await axios.get('http://65.0.45.199:3000/api/staff', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const staff = response.data ; 
            const staffDiv = document.getElementById('staff');
            staffDiv.innerHTML = '';
            staff.forEach(member => {
                const memberDiv = document.createElement('div');
                memberDiv.innerHTML = `
                    <h3>${member.name}</h3>
                    <p>Id: ${member.id}</p>
                    <p>Specialization: ${member.specialization}</p>
                    <p>Availability: ${member.availability}</p>
                    <h4>Services:</h4>
                    <ul>
                        ${Array.isArray(member.services) ? member.services.map(service => `<li>${service.name}</li>`).join('') : '<li>No services assigned</li>'}
                    </ul>
                `;
                staffDiv.appendChild(memberDiv);
            });
        } catch (error) {
            console.error('Error fetching staff with services:', error);
        }
    };

    
    const fetchAppointmentDetails = async () => {
        const token = localStorage.getItem('authToken');
        try {
            const response = await axios.get('http://65.0.45.199:3000/api/appointments', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const appointments = response.data;
            const appointmentDetailsDiv = document.getElementById('appointmentDetails');
            appointmentDetailsDiv.innerHTML = ''; 
    
            if (appointments.length === 0) {
                appointmentDetailsDiv.innerHTML = '<p>No appointments found</p>';
            } else {
                appointments.forEach(appointment => {
                    appointmentDetailsDiv.innerHTML += `
                        <div class="appointment">
                            <h3>Appointment Details</h3>
                            <p>Date: ${appointment.date}</p>
                            <p>Time: ${appointment.time}</p>
                            <p>Customer Name: ${appointment.customerName}</p>
                            <p>Customer Email: ${appointment.customerEmail}</p>
                            <p>Customer Phone: ${appointment.customerPhone}</p>
                            <p>Service: ${appointment.service ? appointment.service.name : 'No service assigned'}</p>
                            <p>Staff: ${appointment.staff ? appointment.staff.name : 'No staff assigned'}</p>
                        </div>
                        <hr>
                    `;
                });
            }
        } catch (error) {
            console.error('Error fetching appointment details:', error);
        }
    };
    
    document.getElementById('bookAppointmentForm').addEventListener('submit', async (e) => {
        e.preventDefault();
    
        const date = document.getElementById('appointmentDate').value;
        const time = document.getElementById('appointmentTime').value;
        const customerName = document.getElementById('customerName').value;
        const customerEmail = document.getElementById('customerEmail').value;
        const customerPhone = document.getElementById('customerPhone').value;
        const staffId = document.getElementById('staffId').value;
        const serviceId = document.getElementById('serviceId').value;
        const token = localStorage.getItem('authToken');
    
        try {
            const response = await axios.post('http://65.0.45.199:3000/api/appointments', 
                { date, time, customerName, customerEmail, customerPhone, staffId, serviceId }, 
                { headers: { Authorization: `Bearer ${token}` } }
            );
    
            if (response.status === 201) {
                alert('Appointment booked successfully');
                fetchAppointmentDetails(); 
                document.getElementById('bookAppointmentForm').reset();
            } else {
                alert('Failed to book appointment');
            }
    
        } catch (err) {
            alert(' error in booking the appointment.Please try again');
        }
    });
    
    const updateAppointment = async (event) => {
        event.preventDefault();
        const token = localStorage.getItem('authToken');
        const appointmentId = document.getElementById('appointmentId').value;
        const newDate = document.getElementById('newDate').value;
        const newTime = document.getElementById('newTime').value;
    
        try {
            const response = await axios.put(`http://65.0.45.199:3000/api/appointments/${appointmentId}`, {
                date: newDate,
                time: newTime
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
    
            if (response.status === 200) {
                alert('Appointment updated successfully');
                document.getElementById('updateAppointmentForm').reset();
            } else {
                alert('Failed to update appointment');
            }
        } catch (error) {
            console.error('Error updating appointment:', error);
        }
    };
    
    const deleteAppointment = async (event) => {
        event.preventDefault();
        const token = localStorage.getItem('authToken');
        const appointmentId = document.getElementById('deleteAppointmentId').value;
    
        try {
            const response = await axios.delete(`http://65.0.45.199:3000/api/appointments/${appointmentId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
    
            if (response.status === 200) {
                alert('Appointment deleted successfully');
                document.getElementById('deleteAppointmentForm').reset();
            } else {
                alert('Failed to delete appointment');
            }
        } catch (error) {
            console.error('Error deleting appointment:', error);
        }
    };
    document.getElementById('updateAppointmentForm').addEventListener('submit', updateAppointment);
    document.getElementById('deleteAppointmentForm').addEventListener('submit', deleteAppointment);


    const initiatePayment = async (appointmentId) => {
    const token = localStorage.getItem('authToken');
    try {
        const response = await axios.post(`http://65.0.45.199:3000/api/appointments/${appointmentId}/payment`, {}, {
            headers: { Authorization: `Bearer ${token}` },
        });

        const options = {
            key: response.data.key_id,
            order_id: response.data.order.id,
            amount: response.data.order.amount,
            currency: 'INR',
            name: 'Sumit Salon Services',
            description: 'Appointment Payment',
            handler: async (paymentResponse) => {
                try {
                    const updateResponse = await axios.post(
                        `http://65.0.45.199:3000/api/appointments/${appointmentId}/payment/status`,
                        {
                            order_id: options.order_id,
                            payment_id: paymentResponse.razorpay_payment_id,
                        },
                        { headers: { Authorization: `Bearer ${token}` } }
                    );

                    alert('Payment successful! Invoice generated.');
                    document.getElementById('makePaymentForm').reset();
                } catch (err) {
                    console.error('Error updating payment status:', err.message);
                }
            }
        };
        const rzp = new Razorpay(options);
        rzp.open();
    } catch (err) {
        console.error('Error initiating payment:', err.message);
    }
};

document.getElementById('makePaymentForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const appointmentId = document.getElementById('paymentAppointmentId').value;
    initiatePayment(appointmentId);
});
    
const leaveReview = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem('authToken');
    const appointmentId = document.getElementById('reviewAppointmentId').value;
    const staffId = document.getElementById('reviewStaffId').value;
    const rating = document.getElementById('reviewRating').value;
    const comment = document.getElementById('reviewComment').value;

    try {
        const response = await axios.post('http://65.0.45.199:3000/api/reviews', {
            appointmentId,
            staffId,
            rating,
            comment
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });

        alert('Review submitted successfully');
        document.getElementById('leaveReviewForm').reset();
    } catch (error) {
        console.error('Error submitting review:', error.message);
    }
};

const respondToReview = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem('authToken');
    const reviewId = document.getElementById('reviewId').value;
    const response = document.getElementById('reviewResponse').value;

    try {
        const res = await axios.put(`http://65.0.45.199:3000/api/reviews/${reviewId}/response`, {
            response
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });

        alert('Response submitted successfully');
        document.getElementById('respondToReviewForm').reset();
    } catch (error) {
        console.error('Error submitting response:', error.message);
    }
};

document.getElementById('leaveReviewForm').addEventListener('submit', leaveReview);
document.getElementById('respondToReviewForm').addEventListener('submit', respondToReview);



    const addServiceForm = document.getElementById('addServiceForm');
    const addStaffForm = document.getElementById('addStaffForm');
    const assignServiceForm = document.getElementById('assignServiceForm');

    addServiceForm.addEventListener('submit', async (e) => {
        e.preventDefault();
    
        const nameElement = document.getElementById('name');
        const descriptionElement = document.getElementById('description');
        const durationElement = document.getElementById('duration');
        const priceElement = document.getElementById('price');
        const availabilityElement = document.getElementById('serviceAvailability');
    
        if (!nameElement || !descriptionElement || !durationElement || !priceElement || !availabilityElement) {
            alert('Form elements are missing!');
            return; 
        }
    
        const name = nameElement.value;
        const description = descriptionElement.value;
        const duration = durationElement.value;
        const price = priceElement.value;
        const availability = availabilityElement.value;
    
        const token = localStorage.getItem('authToken');
    
        try {
            const response = await axios.post('http://65.0.45.199:3000/api/services', 
                { name, description, duration, price, availability },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (response.status === 201) {
                alert('Service added successfully');
                fetchServices();
                document.getElementById('addServiceForm').reset();
            } else {
                alert('Failed to add service');
            }
        } catch (err) {
            console.log('Error adding service', err);
        }
    });
    

    addStaffForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('staffName').value;
        const specialization = document.getElementById('specialization').value;
        const availability = document.getElementById('staffAvailability').value;
        const token = localStorage.getItem('authToken');

        try {
            const response = await axios.post('http://65.0.45.199:3000/api/staff', 
                { name, specialization, availability },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (response.status === 200) {
                alert('Staff added successfully');
                fetchStaffWithServices();
                document.getElementById('addStaffForm').reset();
            } else {
                alert('Failed to add staff');
            }
        } catch (err) {
            console.log('Error adding staff', err);
        }
    });

    assignServiceForm.addEventListener('submit', async (e) => {

        e.preventDefault();
    
        const staffId = document.getElementById('assignStaffId').value; 
    
        const serviceId = document.getElementById('assignServiceId').value; 
    
        const token = localStorage.getItem('authToken');  
        try {
    
            const response = await axios.post('http://65.0.45.199:3000/api/staff/assign-service',
    
                { staffId, serviceId },
    
                { headers: { Authorization: `Bearer ${token}` } }
    
            );
    
            if (response.status === 201) {
    
                alert('Service assigned to staff');
    
                fetchStaffWithServices();
    
                document.getElementById('assignServiceForm').reset();
    
            } else {
    
                alert('Failed to assign service');
    
            }
    
        } catch (err) {
    
            console.log('Error assigning service', err);
    
        }
    
    });

    fetchServices();
    fetchStaffWithServices();
    fetchAppointmentDetails();
});
