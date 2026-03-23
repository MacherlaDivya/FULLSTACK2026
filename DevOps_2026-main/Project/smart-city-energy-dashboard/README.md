# Smart City Energy Management Dashboard

A full stack web application for simulating, monitoring, and analyzing city-scale building energy consumption, renewable energy generation, and CO2 emissions. The application is inspired by the paper **Developing a City Scale Energy System Model Focusing on Building Systems for Sustainable Urban Energy Management** and turns that framing into a practical dashboard for urban operations.

## Features

- JWT authentication with `admin` and `user` roles
- City dashboard for energy demand, renewable generation, and CO2 statistics
- Building search with energy-consumption filtering
- Daily, monthly, and yearly analytics views
- Renewable vs non-renewable comparison charts
- Future demand and emissions forecasting
- Admin tools for buildings, energy records, renewable records, users, and contact submissions
- Contact form stored in MongoDB
- CSV and PDF report export
- Responsive smart-city themed interface with dark mode support

## Tech Stack

- Frontend: React, Vite, Recharts, HTML, CSS, JavaScript
- Backend: Node.js, Express.js
- Database: MongoDB, Mongoose
- Auth: JWT, bcryptjs

## Project Structure

```text
smart-city-energy-dashboard/
  backend/
  frontend/
  README.md
```

## Local Setup

### 1. Install MongoDB and start it locally

Make sure MongoDB is running on the default local connection string, or change the backend environment file accordingly.

### 2. Configure environment variables

Create these files:

- Copy `backend/.env.example` to `backend/.env`
- Copy `frontend/.env.example` to `frontend/.env`

Suggested backend values:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/smart-city-energy-dashboard
JWT_SECRET=replace-with-a-strong-secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
AUTO_SEED=true
```

Suggested frontend values:

```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Install dependencies

From the project root:

```bash
npm install
npm run install:all
```

### 4. Run the application

```bash
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

## Demo Accounts

These are created automatically when the backend starts against an empty database:

- Admin: `admin@smartcity.com` / `Admin@123`
- User: `user@smartcity.com` / `User@123`

## API Areas

- `/api/auth`
- `/api/dashboard`
- `/api/buildings`
- `/api/energy-consumption`
- `/api/renewable-energy`
- `/api/co2-emissions`
- `/api/predictions`
- `/api/contact`
- `/api/admin`

## Notes

- The backend seeds 180 days of sample city energy data when the database is empty.
- Forecasting uses a lightweight linear regression trend model over historical monthly aggregates.
- The frontend exports analytics using browser-side CSV and PDF generation.
