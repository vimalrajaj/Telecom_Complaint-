# Telecom Complaint Management System - Backend

## Overview
A production-ready RESTful API for managing telecom customer complaints. Built with Node.js, Express.js, and MySQL following Clean Architecture principles.

## Tech Stack
- Node.js & Express.js
- MySQL with mysql2
- JWT Authentication
- bcrypt password hashing
- express-validator
- Helmet, CORS, Morgan

## Architecture
Clean Architecture: Routes → Controllers → Services → Repositories → Database

## Prerequisites
- Node.js v18+
- MySQL 8.0+
- npm

## Setup Instructions

### 1. Clone & Install
```bash
cd backend
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env` and update database credentials.

### 3. Initialize Database
```bash
mysql -u root -p < src/database/schema.sql
```

### 4. Seed Database (Optional)
```bash
node src/database/seedRunner.js
```
This creates:
- Admin: admin@telecom.com / Admin@123
- Engineers: engineer1@telecom.com, engineer2@telecom.com / Engineer@123
- Customers: customer1@telecom.com, customer2@telecom.com / Customer@123

### 5. Start Server
```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/api/auth/register` | Register a new user | Public |
| POST | `/api/auth/login` | Login and get token | Public |
| GET | `/api/users/profile` | Get logged-in user profile | Authenticated |
| PUT | `/api/users/profile` | Update user profile | Authenticated |
| POST | `/api/complaints` | Create a new complaint | Customer |
| GET | `/api/complaints` | Get all complaints | Admin/Engineer (all), Customer (own) |
| GET | `/api/complaints/:id` | Get complaint details | Admin/Engineer/Owner |
| PUT | `/api/complaints/:id` | Update complaint status | Admin/Engineer/Owner |
| DELETE | `/api/complaints/:id` | Delete a complaint | Admin |
| POST | `/api/assignments` | Assign complaint to engineer | Admin |
| GET | `/api/assignments` | Get all assignments | Admin |
| GET | `/api/assignments/me` | Get assigned complaints | Engineer |
| PUT | `/api/assignments/:id` | Update assignment status | Engineer/Admin |
| POST | `/api/complaints/:id/comments` | Add comment to complaint | Admin/Engineer/Owner |
| GET | `/api/complaints/:id/comments` | Get comments for complaint | Admin/Engineer/Owner |

## Project Structure
```text
backend/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── database/
│   ├── middlewares/
│   ├── models/
│   ├── repositories/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   └── app.js
├── .env.example
├── package.json
└── README.md
```

## API Response Format

### Success Format
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Format
```json
{
  "success": false,
  "message": "Error description",
  "errors": [ ... ]
}
```

## Roles & Permissions
- **Admin**: Full access. Can manage users, complaints, and assignments.
- **Engineer**: Can view assigned complaints, update assignments, and add comments.
- **Customer**: Can create complaints, view their own complaints, and add comments to them.

## Error Codes
- **400**: Bad Request (Validation errors, missing parameters)
- **401**: Unauthorized (Missing or invalid token, incorrect credentials)
- **403**: Forbidden (Insufficient permissions)
- **404**: Not Found (Resource does not exist)
- **409**: Conflict (Resource already exists, e.g., email)
- **500**: Internal Server Error
