# MongoDB Integration Guide for Bubbly Crochet

## Current Setup Status ✅

Your backend already has:
- ✅ MongoDB connection configured (`config/database.ts`)
- ✅ Mongoose models (User, Product, Order, Review, Settings)
- ✅ JWT authentication middleware (`middleware/auth.ts`)
- ✅ Bcrypt password hashing in User model
- ✅ Express routes and controllers
- ✅ Environment variables (.env)
- ✅ All required npm packages installed

## Step-by-Step Integration

### Step 1: Install and Run MongoDB Locally

#### Option A: MongoDB Community Edition (Recommended for Development)

**macOS (using Homebrew):**
```bash
# Install MongoDB
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB service
brew services start mongodb-community

# Verify it's running
mongosh
# You should see MongoDB shell. Type 'exit' to quit
```

**Verify Connection:**
```bash
mongosh "mongodb://localhost:27017/bubblycrochet"
```

#### Option B: MongoDB Atlas (Cloud - Free Tier)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create a new cluster (Free tier M0)
4. Click "Connect" → "Connect your application"
5. Copy the connection string
6. Update your `.env` file:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bubblycrochet?retryWrites=true&w=majority
```

Replace `username` and `password` with your actual credentials.

---

### Step 2: Verify Your Models Are Correct

Your models are already set up! Let me verify the key ones:

**User Model** (`backend/src/models/User.ts`):
- ✅ Has bcrypt password hashing in pre-save hook
- ✅ Has comparePassword method for login
- ✅ Includes all required fields (email, password, name, role, address, country, countryCode, phone)
- ✅ JWT compatible

**Other Models**:
- ✅ Product, Order, Review, Settings models exist

---

### Step 3: Test Database Connection

**Start your backend server:**
```bash
cd backend
npm run dev
```

**You should see:**
```
✅ MongoDB Connected Successfully
📍 Database: bubblycrochet
🚀 Server running on port 5000
```

If you see connection errors, check:
1. MongoDB is running locally: `brew services list`
2. Connection string is correct in `.env`
3. Firewall isn't blocking port 27017

---

### Step 4: Create Your First Admin User

**Method 1: Using MongoDB Compass (GUI)**

1. Download MongoDB Compass: https://www.mongodb.com/products/compass
2. Connect to `mongodb://localhost:27017`
3. Create database: `bubblycrochet`
4. Create collection: `users`
5. Insert document:

```json
{
  "email": "admin@bubblycrochet.com",
  "password": "$2a$10$rZ1yX5O3K4qYhH9lN2wVe.8B6YN/xGZP3qVjC3mQKwN.xR5Z7Y8Oi",
  "name": "Admin User",
  "role": "admin",
  "avatar": "https://ui-avatars.com/api/?background=d946ef&color=fff&name=Admin",
  "interests": [],
  "isActive": true,
  "createdAt": { "$date": "2025-12-06T00:00:00.000Z" },
  "updatedAt": { "$date": "2025-12-06T00:00:00.000Z" }
}
```

**Note:** The password hash above is for `admin123`. 

**Method 2: Using Node.js Script**

Create this file: `backend/scripts/createAdmin.ts`

```typescript
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bubblycrochet');
    
    const User = mongoose.model('User', new mongoose.Schema({
      email: String,
      password: String,
      name: String,
      role: String,
      avatar: String,
      interests: [String],
      isActive: Boolean
    }));

    // Check if admin exists
    const existingAdmin = await User.findOne({ email: 'admin@bubblycrochet.com' });
    if (existingAdmin) {
      console.log('❌ Admin user already exists');
      process.exit(0);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Create admin
    const admin = await User.create({
      email: 'admin@bubblycrochet.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'admin',
      avatar: 'https://ui-avatars.com/api/?background=d946ef&color=fff&name=Admin',
      interests: [],
      isActive: true
    });

    console.log('✅ Admin user created successfully!');
    console.log('📧 Email: admin@bubblycrochet.com');
    console.log('🔑 Password: admin123');
    
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

createAdmin();
```

**Run it:**
```bash
cd backend
npx ts-node scripts/createAdmin.ts
```

---

### Step 5: Test Authentication Flow

**1. Test Admin Login:**

```bash
curl -X POST http://localhost:5000/api/auth/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"kerrinankhoma@gmail.com","password":"admin123"}'
```

**Expected Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "email": "admin@bubblycrochet.com",
    "name": "Admin User",
    "role": "admin"
  }
}
```

**2. Test Client Registration:**

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email":"client@example.com",
    "password":"password123",
    "name":"Test Client",
    "address":"123 Main St",
    "country":"United States",
    "countryCode":"+1",
    "phone":"5551234567"
  }'
```

---

### Step 6: Understanding Your Authentication System

**How JWT Works in Your App:**

1. **User Registration/Login** → Server generates JWT token
2. **Token Storage** → Frontend stores in localStorage
3. **API Requests** → Frontend sends token in Authorization header
4. **Middleware Validation** → Server verifies token before processing request

**Your JWT Flow:**

```typescript
// 1. User logs in (authController.ts)
const token = generateToken(user._id.toString());

// 2. Token is JWT with:
// - User ID in payload
// - 7 day expiration
// - Signed with JWT_SECRET

// 3. Protected routes use middleware (auth.ts)
// - Extracts token from "Bearer <token>"
// - Verifies with JWT_SECRET
// - Attaches user to request

// 4. Admin routes add extra check
// - Verifies user.role === 'admin'
```

**Your Password Hashing (User model):**

```typescript
// Before saving user to DB:
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// When comparing passwords:
UserSchema.methods.comparePassword = async function(candidatePassword: string) {
  return await bcrypt.compare(candidatePassword, this.password);
};
```

---

### Step 7: Update Frontend to Use Real Backend

Your frontend is already calling the backend! But let's verify the flow:

**Registration Flow:**
1. User fills form → `AuthModal.tsx`
2. Submits → `ClientView.tsx` → `handleAuthSubmit()`
3. Currently: Just switches to login mode
4. **TO DO**: Call `api.auth.register()` to create actual user in DB

**Login Flow:**
1. Admin enters credentials → `Admin.tsx`
2. Calls → `api.auth.loginAdmin()`
3. Backend validates → Returns JWT token
4. Token stored in localStorage
5. Used for all subsequent requests

---

### Step 8: Complete the Integration

**Create Registration API Function:**

Update `frontend/src/services/api.ts`:

```typescript
auth: {
  // Add this new function
  register: async (userData: {
    email: string;
    password: string;
    name: string;
    address: string;
    country: string;
    countryCode: string;
    phone: string;
  }): Promise<boolean> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, userData);
      if (response.data.success) {
        return true;
      }
      return false;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Registration failed");
    }
  },

  // Update loginClient for real authentication
  loginClient: async (email: string, password: string): Promise<{ token: string; user: any }> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password
      });
      
      if (response.data.success && response.data.token) {
        localStorage.setItem('token', response.data.token);
        return response.data;
      }
      throw new Error('Login failed');
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Invalid credentials");
    }
  },

  // ... rest of auth methods
}
```

**Update ClientView to call real API:**

In `ClientView.tsx`, update `handleAuthSubmit`:

```typescript
const handleAuthSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setAuthError(null);

  const formData = new FormData(e.currentTarget);
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  // Validate Input
  const validationError = api.auth.validateClientPayload(email, password);
  if (validationError) {
    setAuthError(validationError);
    return;
  }

  try {
    if (authMode === 'SIGNUP') {
      // Call real registration API
      const name = formData.get('name') as string;
      const address = formData.get('address') as string;
      const country = formData.get('country') as string;
      const countryCode = formData.get('countryCode') as string;
      const phone = formData.get('phone') as string;

      await api.auth.register({
        email, password, name, address, country, countryCode, phone
      });

      // Switch to login after successful registration
      setAuthMode('LOGIN');
      setAuthError('Account created! Please log in.');
      return;
    }

    // Login mode - call real login API
    const result = await api.auth.loginClient(email, password);
    onLogin(result.user.email, result.user.name, result.user.address, result.user.phone, result.user.country, result.user.countryCode);
    setShowAuthModal(false);
  } catch (error: any) {
    setAuthError(error.message);
  }
};
```

---

### Step 9: Test the Complete Flow

**1. Start Backend:**
```bash
cd backend
npm run dev
```

**2. Start Frontend:**
```bash
cd frontend
npm run dev
```

**3. Test Registration:**
- Go to http://localhost:3000
- Click "Sign In"
- Switch to "Create Account"
- Fill all fields
- Submit
- Should show "Account created! Please log in."

**4. Test Login:**
- Enter the email and password you just registered
- Should log you in and redirect to landing page

**5. Test Admin:**
- Go to http://localhost:3000/admin.html
- Login with: admin@bubblycrochet.com / admin123
- Should access admin dashboard

---

### Step 10: Verify Data in MongoDB

**Using MongoDB Compass:**
1. Open Compass
2. Connect to localhost:27017
3. Select `bubblycrochet` database
4. View `users` collection
5. You should see your registered users

**Using mongosh:**
```bash
mongosh "mongodb://localhost:27017/bubblycrochet"

# View all users
db.users.find().pretty()

# View only clients
db.users.find({ role: "client" }).pretty()

# View only admins
db.users.find({ role: "admin" }).pretty()
```

---

## Security Checklist

- ✅ Passwords are hashed with bcrypt (salt rounds: 10)
- ✅ JWT tokens expire after 7 days
- ✅ Password fields use `select: false` (not returned by default)
- ✅ Admin routes protected with role check
- ✅ CORS configured for specific origins
- ⚠️ **TODO**: Change JWT_SECRET in production
- ⚠️ **TODO**: Add rate limiting for login attempts
- ⚠️ **TODO**: Add email verification for new accounts

---

## Common Issues & Solutions

### Issue 1: "MongooseError: Operation `users.findOne()` buffering timed out"
**Solution:** MongoDB isn't running
```bash
brew services start mongodb-community
```

### Issue 2: "CORS error" in browser console
**Solution:** Check FRONTEND_URL and ADMIN_URL in .env match your running ports

### Issue 3: "jwt malformed" error
**Solution:** Token format is incorrect. Should be "Bearer <token>"

### Issue 4: Admin can't login
**Solution:** Make sure admin user exists in database with role: 'admin'

### Issue 5: Password doesn't match
**Solution:** 
- Check bcrypt is working: password should start with `$2a$` in DB
- Verify comparePassword method is being called

---

## Next Steps

1. ✅ **Database Connected** - You're here!
2. **Create Admin User** - Follow Step 4
3. **Test Authentication** - Follow Step 5
4. **Integrate Products** - Create product CRUD endpoints
5. **Integrate Orders** - Create order management endpoints
6. **Integrate Reviews** - Create review endpoints
7. **Add File Upload** - For product images (use Multer + Cloudinary)
8. **Add Email Notifications** - For order updates (use Nodemailer)
9. **Deploy** - Use Railway/Render for backend, Vercel for frontend

---

## Useful Commands

```bash
# Start MongoDB
brew services start mongodb-community

# Stop MongoDB
brew services stop mongodb-community

# MongoDB Shell
mongosh

# View all databases
show dbs

# Use bubblycrochet database
use bubblycrochet

# View all collections
show collections

# Count documents in users collection
db.users.countDocuments()

# Delete all users (BE CAREFUL!)
db.users.deleteMany({})

# Create index on email (for faster queries)
db.users.createIndex({ email: 1 }, { unique: true })
```

---

## Resources

- MongoDB Documentation: https://docs.mongodb.com/
- Mongoose Documentation: https://mongoosejs.com/docs/
- JWT Documentation: https://jwt.io/
- Bcrypt Documentation: https://github.com/kelektiv/node.bcrypt.js

---

**You're all set! Your backend is ready for database integration. Just follow the steps above and you'll have a fully functional authentication system with MongoDB.**
