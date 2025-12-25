import dotenv from 'dotenv';
import { randomBytes } from 'crypto';

dotenv.config();

// Generate admin path if not set
const generateAdminPath = (): string => {
  const randomString = randomBytes(32).toString('hex');
  return `manage-panel-${randomString}`;
};

export const config = {
  port: parseInt(process.env.PORT || '3001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    name: process.env.DB_NAME || 'personal_blog',
    user: process.env.DB_USER || 'user',
    password: process.env.DB_PASSWORD || 'password',
    url: process.env.DATABASE_URL,
  },
  
  admin: {
    path: process.env.ADMIN_PATH || generateAdminPath(),
  },
  
  storage: {
    provider: process.env.STORAGE_PROVIDER || 'aws', // 'aws' | 'aliyun' | 'tencent'
    aws: {
      region: process.env.AWS_REGION || 'us-east-1',
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
      bucket: process.env.AWS_S3_BUCKET || '',
    },
    aliyun: {
      region: process.env.OSS_REGION || '',
      accessKeyId: process.env.OSS_ACCESS_KEY_ID || '',
      accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET || '',
      bucket: process.env.OSS_BUCKET || '',
    },
  },
  
  cdn: {
    domain: process.env.CDN_DOMAIN || '',
  },
  
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  },
  
  upload: {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  },
};
