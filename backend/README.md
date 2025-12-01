# GiziSync Backend

The REST API server for GiziSync, built with Node.js, Express, and MongoDB.

## Features
- **Authentication**: JWT-based auth for Admins and Kitchen Operators.
- **Kitchen Management**: CRUD operations for kitchen profiles.
- **Reporting**: Handle daily procurement reports and receipt uploads.
- **Commodities**: Manage market prices for anomaly detection.

## Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose)
- **Security**: Helmet, CORS, BCrypt

## Setup & Run

1. **Install Dependencies**
   ```bash
   bun install
   ```

2. **Environment Variables**
   Create a `.env` file in this directory:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/gizisync
   JWT_SECRET=your_secret_key
   ```

   ```

3. **Run Server**
   ```bash
   bun run dev
   ```

4. **Seed Database (Optional)**
   To create a default admin user (`admin` / `admin123`):
   ```bash
   bun seed.js
   ```

## API Endpoints
### Auth & Users
- `POST /api/auth/register`: Register new user.
- `POST /api/auth/login`: Login user.
- `GET /api/auth`: Get all users.
- `DELETE /api/auth/:id`: Delete user.
- `PUT /api/auth/:id`: Update user profile/password.

### Kitchens
- `GET /api/kitchens`: Get all kitchens.
- `POST /api/kitchens`: Create new kitchen.
- `DELETE /api/kitchens/:id`: Delete kitchen.
- `PUT /api/kitchens/:id`: Update kitchen details.

### Commodities
- `GET /api/commodities`: Get commodity prices.
- `POST /api/commodities`: Create/Update commodity.
- `DELETE /api/commodities/:id`: Delete commodity.
- `PUT /api/commodities/:id`: Update commodity details.

### Reports
- `GET /api/reports`: Get all reports.
- `POST /api/reports`: Submit daily report.
- `PUT /api/reports/:id`: Update report status (Verify/Reject).
