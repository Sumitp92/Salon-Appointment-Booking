# ✂Salon Appointment Booking 

A RESTful backend API for managing salon appointments, built with Node.js, Express, and MongoDB. Supports customer booking, staff rating, admin dashboard, and email confirmations via SendGrid. Ideal for any salon or spa booking system.

---

## ✅ Features

- User signup & login (JWT-based)
- Book, cancel, and view appointments
- Browse available services and staff
- Rate staff after completed appointment
- Admin panel for managing:
  - Services
  - Staff
  - Appointments
- Email confirmation using SendGrid
- Role-based authentication (User/Admin)

---

## 📁 Project Structure

├── app.js
├── controllers/
├── models/
├── routes/
├── middleware/
├── utils/
├── config/
├── .env
└── README.md

---

## ⚙️ Tech Stack

- **Node.js**
- **Express.js**
- **MongoDB + Mongoose**
- **JWT** – Authentication
- **bcrypt** – Password hashing
- **SendGrid** – Email notifications
- **dotenv** – Env variables
- **CORS & Helmet** – Security middleware

---

## 🔐 Authentication

All routes (except signup/login) are protected using JWT.Pass the token via header:
`Authorization: Bearer <token>`

---

## 🚀 API Endpoints

### 👤 Auth

- `POST /api/auth/signup` – Register new user  
- `POST /api/auth/login` – Login and receive token  

### 🧖 Services

- `GET /api/services/` – Get all services (public)  
- `POST /api/services/` – Add service (admin only)  
- `PUT /api/services/:id` – Update service (admin only)  
- `DELETE /api/services/:id` – Delete service (admin only)  

### 💇 Staff

- `GET /api/staff/` – Get all staff  
- `POST /api/staff/` – Add staff (admin only)  
- `PUT /api/staff/:id` – Update staff info (admin only)  
- `DELETE /api/staff/:id` – Remove staff (admin only)  

### 📅 Appointments

- `POST /api/appointments/` – Book appointment  
- `GET /api/appointments/` – View user's appointments  
- `DELETE /api/appointments/:id` – Cancel appointment  
- `GET /api/admin/appointments` – View all appointments (admin)  

### 🌟 Ratings

- `POST /api/ratings/` – Rate staff  
- `GET /api/ratings/:staffId` – View ratings of a staff member  

---

## 📧 Email Notifications

- Appointment confirmations are sent via **SendGrid**
- Admin receives notification of new bookings
- Emails include appointment time, service, and staff details

---

## 🧪 How to Run Locally

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/salon-app.git
   cd salon-app
   
2. **Install dependencies**
     ```bash
    npm install

3. **Configure .env**
   ```bash
   MONGO_URI=
   JWT_SECRET=
   SENDGRID_API_KEY=
   ADMIN_EMAIL=
   
4. **Start the server**
   ```bash
   npm start
---

## 🧪 Testing the API

Use **Postman** or **Thunder Client** to test endpoints.  
Login and use the JWT token in the header as: `Authorization: Bearer <token>`

- All protected routes require this token.
- Admin-only routes require the user's role to be `"admin"` in the database.

---

## 👨‍💻 Author

**Sumit Patil**  
GitHub: @Sumitp92

---
