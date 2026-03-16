export const config = {
  port: parseInt(process.env.PORT || '8080', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'super-secret-jwt-key-change-in-production',
  jwtRefreshSecret:
    process.env.JWT_REFRESH_SECRET || 'super-secret-refresh-key-change-in-production',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  databaseUrl: process.env.DATABASE_URL || '',
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    username: process.env.REDIS_USERNAME || '',
    password: process.env.REDIS_PASSWORD || '',
    ttl: parseInt(process.env.REDIS_TTL || '300', 10),
  },
  aws: {
    region: process.env.AWS_REGION || 'us-east-1',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
  ses: {
    fromEmail: process.env.SES_FROM_EMAIL || 'no-reply@yourdomain.com',
    fromName: process.env.SES_FROM_NAME || 'Your App',
  },
  appUrl: process.env.APP_URL || 'http://localhost:3000',
}
