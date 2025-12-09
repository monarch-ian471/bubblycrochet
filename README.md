# Bubbly Crochet - Full Stack E-Commerce Platform

A modern, full-stack e-commerce platform for handmade crochet products built with React, TypeScript, Express, and MongoDB.

## 🎯 Features

### Client Features
- 🛍️ Browse and search products
- 🛒 Shopping cart management
- 👤 User authentication and profiles
- 📦 Order placement and tracking
- ⭐ Product reviews and ratings
- 📱 Fully responsive design

### Admin Features
- 📊 Analytics dashboard
- 🏷️ Product management (CRUD)
- 📋 Order processing and status updates
- ⚙️ Store settings configuration
- 👥 User management

## 🏗️ Architecture

```
bubblycrochet/
├── backend/                 # Express + MongoDB API
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── models/         # Mongoose schemas
│   │   ├── controllers/    # Request handlers
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Auth & validation
│   │   ├── services/       # Business logic
│   │   └── server.ts       # Entry point
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/               # React + TypeScript
    ├── src/
    │   ├── components/     # UI components
    │   │   ├── client/    # Client-facing
    │   │   └── admin/     # Admin panel
    │   ├── services/      # API integration
    │   ├── App.tsx
    │   └── types.ts
    ├── package.json
    └── vite.config.ts
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Update `.env` with your MongoDB URI and other settings:
```env
MONGODB_URI=mongodb://localhost:27017/bubblycrochet
JWT_SECRET=your_secret_key_here
PORT=5000
FRONTEND_URL=http://localhost:3000
```

5. Start the backend server:
```bash
npm run dev
```

Backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Update `.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

5. Start the frontend development server:
```bash
npm run dev
```

Frontend will run on `http://localhost:3000`

## 📡 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Product Endpoints
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Order Endpoints
- `POST /api/orders` - Create order
- `GET /api/orders/my-orders` - Get user orders
- `GET /api/orders` - Get all orders (Admin)
- `PUT /api/orders/:id/status` - Update order status (Admin)

### Review Endpoints
- `GET /api/reviews/product/:productId` - Get product reviews
- `POST /api/reviews` - Create review
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review

### Settings Endpoints
- `GET /api/settings` - Get store settings
- `PUT /api/settings` - Update settings (Admin)

## 🗄️ Database Models

### User Model
- email, password, name, role
- address, phone, bio, interests
- avatar, isActive, timestamps

### Product Model
- name, description, price, category
- images, inStock, discount
- daysToMake, shippingCost
- timestamps

### Order Model
- userId, userName, contactEmail
- shippingAddress, items[]
- totalAmount, shippingTotal
- specialRequest, status
- timestamps

### Review Model
- productId, userId, userName
- rating (1-5), comment
- timestamps

### Settings Model
- storeName, ownerName
- contactEmail, contactPhone
- shopLocation, logoUrl
- social media URLs
- copyrightText

## 🛠️ Tech Stack

### Backend
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Frontend
- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Axios** - HTTP client
- **Lucide React** - Icons
- **Recharts** - Analytics charts
- **D3.js** - Data visualizations

## 📝 Development

### Backend Scripts
```bash
npm run dev      # Start development server with hot reload
npm run build    # Build for production
npm start        # Start production server
```

### Frontend Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

## 🔒 Environment Variables

### Backend (.env)
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters
JWT_EXPIRE=7d
FRONTEND_URL=https://your-app.vercel.app
ADMIN_URL=https://your-app.vercel.app/admin.html
ALLOWED_ORIGINS=https://your-app.vercel.app
```

### Frontend (.env)
```env
VITE_API_URL=https://your-app.vercel.app/api
GEMINI_API_KEY=your_gemini_api_key_if_using_ai_features
```

**Note**: Never commit `.env` files to Git. Use `.env.example` files as templates.

## 🧪 Testing

To test the API, you can use:
- Postman or Insomnia
- Thunder Client (VS Code extension)
- curl commands

Health check endpoint:
```bash
curl http://localhost:5000/api/health
```

## 📦 Deployment

### Production Deployment to Vercel

This project is configured for seamless deployment to Vercel. See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for complete deployment guide.

#### Quick Deploy Steps

1. **Prerequisites**
   - MongoDB Atlas account with cluster set up
   - Vercel account connected to GitHub
   - Environment variables prepared

2. **Deploy to Vercel**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Login and deploy
   vercel login
   vercel
   ```

3. **Configure Environment Variables in Vercel Dashboard**
   - `MONGODB_URI` - Your MongoDB Atlas connection string
   - `JWT_SECRET` - Strong secret key (min 32 characters)
   - `FRONTEND_URL` - Your Vercel app URL
   - `ADMIN_URL` - Your Vercel app URL/admin.html
   - `ALLOWED_ORIGINS` - Your Vercel app URL
   - `VITE_API_URL` - Your Vercel app URL/api

4. **Access Your Application**
   - Client: `https://your-app.vercel.app`
   - Admin: `https://your-app.vercel.app/admin.html`
   - API: `https://your-app.vercel.app/api`

#### Deployment Files
- `vercel.json` - Vercel configuration
- `.env.example` - Environment variable template
- `DEPLOYMENT.md` - Detailed deployment guide
- `PRODUCTION_CHECKLIST.md` - Pre-deployment checklist

### Alternative Deployment Options

#### Backend
- Railway
- Render
- Heroku
- DigitalOcean App Platform
- AWS Elastic Beanstalk

#### Frontend
- Netlify
- AWS S3 + CloudFront
- GitHub Pages
- Firebase Hosting

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👤 Author

Built with ❤️ for Bubbly Crochet

## 🆘 Support

For issues and questions, please open an issue in the GitHub repository.
