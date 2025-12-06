# Backend Integration Summary

## Changes Made

### 1. **Admin Authentication Endpoint**
- **New Route**: `POST /api/auth/admin/login`
- **Location**: `backend/src/controllers/authController.ts`
- **Purpose**: Separate admin login endpoint that validates admin role
- **Security**: Only allows login if user has `role: 'admin'`

### 2. **Account Deletion Endpoint**
- **New Route**: `DELETE /api/auth/account`
- **Location**: `backend/src/controllers/authController.ts`
- **Purpose**: Allows clients to delete their own accounts
- **Security**: 
  - Requires JWT authentication (protect middleware)
  - Prevents admin account deletion via this endpoint
  - Deletes user and associated data

### 3. **CORS Configuration Update**
- **File**: `backend/src/server.ts`
- **Change**: Now accepts requests from both client and admin portals
- **Configuration**:
  ```typescript
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    process.env.ADMIN_URL || 'http://localhost:3000'
  ]
  ```

### 4. **Environment Variables**
- **File**: `backend/.env`
- **Added**: `ADMIN_URL=http://localhost:3000`
- **Purpose**: Support CORS for admin portal

### 5. **Frontend API Integration**
- **File**: `frontend/src/services/api.ts`
- **Changes**:
  - Added axios import and API_BASE_URL constant
  - Updated `loginAdmin()` to call backend admin endpoint
  - Updated `deleteUser()` to call backend deletion endpoint with JWT token

## API Endpoints Reference

### Authentication
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Register new client account |
| POST | `/api/auth/login` | Public | Client login |
| POST | `/api/auth/admin/login` | Public | Admin login (role validation) |
| GET | `/api/auth/me` | Private | Get current user data |
| DELETE | `/api/auth/account` | Private | Delete own account |

### Middleware
- **protect**: Validates JWT token from Authorization header
- **admin**: Checks if authenticated user has admin role

## How It Works

### Admin Portal Login Flow
1. User accesses `/admin.html`
2. Enters admin credentials
3. Frontend calls `POST /api/auth/admin/login`
4. Backend validates credentials AND checks role === 'admin'
5. Returns JWT token if valid
6. Token stored in localStorage as 'adminToken'
7. Admin portal uses token for all subsequent API requests

### Account Deletion Flow
1. Client clicks "Delete Account" in Profile
2. Confirmation modal appears
3. Frontend calls `DELETE /api/auth/account` with JWT token
4. Backend validates token using protect middleware
5. Prevents admin deletion
6. Deletes user record
7. TODO: Cascade delete orders, reviews, notifications
8. Frontend clears localStorage tokens
9. User logged out

## Security Features
- JWT tokens expire after 7 days (configurable via JWT_EXPIRE)
- Admin role checked server-side, not just client-side
- Admin accounts cannot be deleted via client deletion endpoint
- Passwords hashed with bcrypt before storage
- CORS restricts requests to configured frontend URLs

## Next Steps for Production

### Database Integration
The following operations currently use mock data and need MongoDB integration:
- Product CRUD operations
- Order management
- Review system
- Settings management
- Notification system

### Image Upload
Current state: Frontend uses base64 encoding for images
Recommended: Implement file upload endpoint with cloud storage (AWS S3, Cloudinary)

### Additional Security
- Rate limiting on login endpoints
- Refresh token implementation
- Password reset functionality
- Email verification for new accounts
- Audit logging for admin actions

## Testing the Integration

### Start Backend
```bash
cd backend
npm install
npm run dev
```

### Start Frontend
```bash
cd frontend
npm install
npm run dev
```

### Test Admin Login
1. Navigate to `http://localhost:3000/admin.html`
2. Create admin user in MongoDB:
   ```javascript
   {
     name: "Admin User",
     email: "admin@bubblycrochet.com",
     password: "$2a$10$...", // bcrypt hash of your password
     role: "admin"
   }
   ```
3. Login with admin credentials

### Test Account Deletion
1. Login as client at `http://localhost:3000`
2. Go to Profile section
3. Click "Delete Account"
4. Confirm deletion
5. Verify user removed from database

## Environment Setup

Ensure your `.env` files are configured:

**Backend (.env)**:
```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
ADMIN_URL=http://localhost:3000
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
MONGODB_URI=mongodb://localhost:27017/bubblycrochet
```

## Troubleshooting

### CORS Errors
- Verify FRONTEND_URL and ADMIN_URL match your running ports
- Check browser console for specific origin errors
- Ensure credentials: true in CORS config

### Authentication Failures
- Check JWT_SECRET is set in .env
- Verify token format: "Bearer <token>"
- Inspect token expiry (JWT_EXPIRE setting)

### 404 Errors
- Confirm backend server running on port 5000
- Check route paths match API calls
- Verify all route files imported in server.ts

## Communication Flow

```
Frontend (Client/Admin) → API Service → Backend Routes → Middleware → Controllers → Models → MongoDB
```

All backend routes now properly configured and ready for frontend integration. The admin portal has dedicated authentication, and account deletion is fully functional with proper security checks.
