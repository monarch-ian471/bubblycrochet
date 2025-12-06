import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from parent directory
dotenv.config({ path: path.join(__dirname, '../.env') });

const createAdmin = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bubblycrochet';
    console.log('🔌 Connecting to MongoDB...');
    
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB');

    // Define minimal User schema for this script
    const UserSchema = new mongoose.Schema({
      email: String,
      password: String,
      name: String,
      role: String,
      avatar: String,
      interests: [String],
      isActive: Boolean,
      createdAt: Date,
      updatedAt: Date
    });

    const User = mongoose.model('User', UserSchema);

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@bubblycrochet.com' });
    if (existingAdmin) {
      console.log('❌ Admin user already exists!');
      console.log('📧 Email: admin@bubblycrochet.com');
      console.log('🔑 Password: admin123 (if you haven\'t changed it)');
      await mongoose.connection.close();
      process.exit(0);
    }

    // Hash password with bcrypt
    console.log('🔐 Hashing password...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    // Create admin user
    console.log('👤 Creating admin user...');
    const admin = await User.create({
      email: 'admin@bubblycrochet.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'admin',
      avatar: 'https://ui-avatars.com/api/?background=d946ef&color=fff&name=Admin',
      interests: [],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    console.log('\n✅ Admin user created successfully!\n');
    console.log('═══════════════════════════════════');
    console.log('📧 Email:    admin@bubblycrochet.com');
    console.log('🔑 Password: admin123');
    console.log('═══════════════════════════════════');
    console.log('\n⚠️  IMPORTANT: Change this password after first login!\n');

    await mongoose.connection.close();
    console.log('👋 Database connection closed');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

// Run the script
createAdmin();
