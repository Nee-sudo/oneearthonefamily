import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://neer:bjFBXFCYd00Gifiv@pdf-uploading-site.ges8oic.mongodb.net/oneearth?retryWrites=true&w=majority';

export const connectDatabase = async (): Promise<void> => {
  const options = {
    autoIndex: true,
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    family: 4
  };

  try {
    mongoose.connection.on('connecting', () => {
      console.log('⚡ Mongoose: Connecting to MongoDB Atlas...');
    });

    mongoose.connection.on('connected', () => {
      console.log('✅ Mongoose: Successfully connected to MongoDB Atlas cluster.');
    });

    mongoose.connection.on('error', (err) => {
      console.error('❌ Mongoose: Connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ Mongoose: Disconnected from database. Attempting re-connection...');
    });

    await mongoose.connect(MONGO_URI, options);
  } catch (error) {
    console.error('❌ Mongoose: Initial database connection failed:', error);
    process.exit(1);
  }
};

// Graceful termination handling
export const disconnectDatabase = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    console.log('🔌 Mongoose: Disconnected gracefully.');
  } catch (error) {
    console.error('❌ Mongoose: Error during disconnect:', error);
  }
};
