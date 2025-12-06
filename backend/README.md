# Bubbly Crochet Backend API

RESTful API for the Bubbly Crochet e-commerce platform built with Express, TypeScript, and MongoDB.

## Features

- 🔐 JWT Authentication
- 👤 User Management (Client & Admin roles)
- 🛍️ Product Management
- 📦 Order Processing
- ⭐ Product Reviews
- ⚙️ Store Settings
- 🔒 Role-based Access Control

## Setup

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. Install dependencies:
\`\`\`bash
cd backend
npm install
\`\`\`

2. Create `.env` file:
\`\`\`bash
cp .env.example .env
\`\`\`

3. Update `.env` with your values:
\`\`\`env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
FRONTEND_URL=http://localhost:3000
\`\`\`

4. Start development server:
\`\`\`bash
npm run dev
\`\`\`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Orders
- `POST /api/orders` - Create order (Protected)
- `GET /api/orders/my-orders` - Get user orders (Protected)
- `GET /api/orders` - Get all orders (Admin)
- `GET /api/orders/:id` - Get single order (Protected)
- `PUT /api/orders/:id/status` - Update order status (Admin)

### Reviews
- `GET /api/reviews/product/:productId` - Get product reviews
- `POST /api/reviews` - Create review (Protected)
- `PUT /api/reviews/:id` - Update review (Protected)
- `DELETE /api/reviews/:id` - Delete review (Protected)

### Settings
- `GET /api/settings` - Get store settings
- `PUT /api/settings` - Update settings (Admin)

## Database Models

- **User**: Authentication and profile management
- **Product**: Product catalog
- **Order**: Order management
- **Review**: Product reviews
- **Settings**: Store configuration

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server

## Tech Stack

- Express.js - Web framework
- TypeScript - Type safety
- MongoDB - Database
- Mongoose - ODM
- JWT - Authentication
- bcryptjs - Password hashing
