# Bubbly Crochet Frontend

Modern React + TypeScript frontend for the Bubbly Crochet e-commerce platform.

## Features

- 🎨 Beautiful UI with Tailwind-like styling
- 🛍️ Product browsing and search
- 🛒 Shopping cart functionality
- 👤 User authentication
- 📦 Order management
- ⭐ Product reviews
- 📱 Responsive design
- 🔐 Role-based access (Client & Admin)

## Setup

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation

1. Install dependencies:
\`\`\`bash
cd frontend
npm install
\`\`\`

2. Create \`.env\` file:
\`\`\`bash
cp .env.example .env
\`\`\`

3. Update \`.env\`:
\`\`\`env
VITE_API_URL=http://localhost:5000/api
\`\`\`

4. Start development server:
\`\`\`bash
npm run dev
\`\`\`

The app will be available at http://localhost:3000

## Project Structure

\`\`\`
frontend/
├── src/
│   ├── components/
│   │   ├── client/        # Client-facing components
│   │   │   ├── NavBar.tsx
│   │   │   ├── Hero.tsx
│   │   │   ├── ProductGrid.tsx
│   │   │   ├── ProductDetail.tsx
│   │   │   ├── CartDrawer.tsx
│   │   │   ├── CheckoutModal.tsx
│   │   │   ├── AuthModal.tsx
│   │   │   ├── Profile.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── OrderConfirmation.tsx
│   │   ├── admin/         # Admin panel components
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── ProductsManagement.tsx
│   │   │   ├── OrdersManagement.tsx
│   │   │   └── SettingsManagement.tsx
│   │   ├── ClientView.tsx
│   │   ├── AdminView.tsx
│   │   └── Visuals.tsx
│   ├── services/
│   │   ├── api.ts         # Legacy mock API
│   │   ├── apiClient.ts   # New Axios API client
│   │   └── mockData.ts
│   ├── App.tsx
│   ├── index.tsx
│   └── types.ts
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
\`\`\`

## API Integration

The frontend uses \`apiClient.ts\` to communicate with the backend API:

- **authAPI**: Authentication endpoints
- **productsAPI**: Product management
- **ordersAPI**: Order processing
- **reviewsAPI**: Product reviews
- **settingsAPI**: Store configuration

## Scripts

- \`npm run dev\` - Start development server
- \`npm run build\` - Build for production
- \`npm run preview\` - Preview production build

## Tech Stack

- React 19
- TypeScript
- Vite
- Axios
- Lucide React (icons)
- Recharts (analytics)
- D3.js (visualizations)
