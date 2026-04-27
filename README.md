# MFA Authentication System

A complete production-ready MFA Authentication system built with Node.js, Express, and Redis.

## Features

- **Multi-Login**: Email/Password, Google OAuth, Microsoft OAuth
- **Multi-MFA**: Email OTP (SendGrid/Azure), Authenticator App (TOTP)
- **Config-driven Email Provider**: Switch between SendGrid and Azure Communication Services easily.
- **Security**: SHA256 hashed OTPs, rate-limiting on OTP, 5 min expiry, JWT issued only after MFA.

## Prerequisites

- Node.js
- Redis server running
- Environment variables configured

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configuration**
   Copy `.env.example` to `.env` and fill in your details:
   ```bash
   cp .env.example .env
   ```
   *Note: Ensure `REDIS_URL` points to your running Redis instance.*

3. **Run the Server**
   ```bash
   npm start
   ```
   Or for development:
   ```bash
   npm run dev
   ```

4. **Access the Application**
   - **UI**: http://localhost:3000
   - **Swagger API Docs**: http://localhost:3000/api-docs

## Architecture

- **`config/`**: Configuration setups for ENV, Passport, Redis, Swagger.
- **`controllers/`**: Handles incoming HTTP requests.
- **`middleware/`**: JWT verification middleware.
- **`models/`**: In-memory user store (can be easily replaced with MongoDB/PostgreSQL).
- **`services/`**: Business logic including Email, OTP, TOTP, and OAuth handling.
- **`utils/`**: Helper files like JWT generation.
- **`public/`**: Basic UI for testing the flow.
