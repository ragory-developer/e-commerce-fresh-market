import dotenv from 'dotenv';
import { expand } from 'dotenv-expand';
expand(dotenv.config());

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  database: {
    url: process.env.DATABASE_URL || '',
  },
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET || 'access-secret',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'refresh-secret',
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  apiUrl: process.env.API_URL || `http://localhost:${process.env.PORT || '5000'}`,
  sms: {
    gatewayUrl: process.env.SMS_GATEWAY_URL || 'https://smsmassdata.massdata.xyz/api/sms/send',
    apiKey: process.env.SMS_API_KEY || '',
    senderId: process.env.SMS_SENDER_ID || '',
    costPerSms: parseFloat(process.env.SMS_COST_PER_SMS || '0.40'),
  },
  orderDeductionAmount: parseFloat(process.env.ORDER_DEDUCTION_AMOUNT || '0'),
};

console.log(`[Config] Order Deduction Amount: ${config.orderDeductionAmount}`);
