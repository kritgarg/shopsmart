import 'dotenv/config';

export const env = {
  PORT: process.env.PORT || 5001,
  DATABASE_URL: process.env.DATABASE_URL,
  CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
};

// Validate required variables
const requiredConfig = ['DATABASE_URL'];
for (const key of requiredConfig) {
  if (!env[key]) {
    console.warn(`Warning: Missing required environment variable: ${key}`);
  }
}
