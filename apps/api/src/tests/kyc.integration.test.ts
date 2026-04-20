import request from 'supertest';
import { app } from '../index';
import { prismaMock } from './setup';

describe('KYC Integration Tests', () => {
    it('should initiate KYC and update status to PENDING', async () => {
        prismaMock.workerProfile.findUnique.mockResolvedValue({
            id: 'profile_1',
            userId: 'user_1',
            kycStatus: 'UNVERIFIED',
            kycAttempts: 0,
            firstName: 'John',
            lastName: 'Doe',
            photoUrl: null,
            dateOfBirth: null,
            gender: null,
            address: null,
            education: null,
            age: null,
            city: null,
            state: null,
            pincode: null,
            latitude: null,
            longitude: null,
            bio: null,
            skills: [],
            categories: [],
            aadhaarNumber: null,
            aadhaarVerified: false,
            aadhaarVerifiedAt: null,
            groomingCertified: false,
            groomingBadges: [],
            reliabilityScore: 0,
            totalGigsDone: 0,
            avgPay: 0,
            isReadyToWork: false,
            isAvailable: true,
            isDeliveryPartner: false,
            subscriptionStatus: null,
            subscriptionAmount: null,
            subscriptionDue: null,
            lastSubscriptionPaidAt: null,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        prismaMock.workerProfile.update.mockResolvedValue({
            id: 'profile_1',
            userId: 'user_1',
            kycStatus: 'PENDING',
            kycAttempts: 1,
            firstName: 'John',
            lastName: 'Doe',
            photoUrl: null,
            dateOfBirth: null,
            gender: null,
            address: null,
            education: null,
            age: null,
            city: null,
            state: null,
            pincode: null,
            latitude: null,
            longitude: null,
            bio: null,
            skills: [],
            categories: [],
            aadhaarNumber: null,
            aadhaarVerified: false,
            aadhaarVerifiedAt: null,
            groomingCertified: false,
            groomingBadges: [],
            reliabilityScore: 0,
            totalGigsDone: 0,
            avgPay: 0,
            isReadyToWork: false,
            isAvailable: true,
            isDeliveryPartner: false,
            subscriptionStatus: null,
            subscriptionAmount: null,
            subscriptionDue: null,
            lastSubscriptionPaidAt: null,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        const response = await request(app)
            .post('/api/v1/kyc/initiate')
            .send({ userId: 'user_1' });

        expect(response.status).toBe(200);
        expect(response.body.status).toBe('PENDING');
        expect(response.body.attempts).toBe(1);
    });
});
