import request from 'supertest';
import { app } from '../index';
import { prismaMock } from './setup';
import jwt from 'jsonwebtoken';

describe('Auth Integration Tests', () => {
    it('should fallback securely to 123456 OTP when Twilio is down or missing credentials', async () => {
        const response = await request(app)
            .post('/api/v1/auth/verify-otp')
            .send({ phone: '9999999999', otp: '123456' });

        // Prisma isn't mocked to return a user yet, so it should attempt to Create one.
        // Even if Prisma fails (because we mocked it to return undefined or throw), we expect a clean JSON error, NOT an HTML crash
        expect(response.headers['content-type']).toMatch(/json/);
        
        // Let's actually mock Prisma to return a user
        prismaMock.user.findUnique.mockResolvedValue({
            id: 'mock_user_1',
            phone: '9999999999',
            role: 'WORKER',
            isActive: true,
            isPhoneVerified: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            email: null,
            passwordHash: null,
            isEmailVerified: false,
            preferredLanguage: 'en',
            fcmToken: null,
            lastLoginAt: null,
            onboardingState: 'ANONYMOUS'
        });

        const successResponse = await request(app)
            .post('/api/v1/auth/verify-otp')
            .send({ phone: '9999999999', otp: '123456' });

        expect(successResponse.status).toBe(200);
        expect(successResponse.body.success).toBe(true);
        expect(successResponse.body.token).toBeDefined();
    });
});
