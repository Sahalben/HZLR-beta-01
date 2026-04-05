import request from 'supertest';
import { app } from '../index';
import { prismaMock } from './setup';
import jwt from 'jsonwebtoken';

describe('Jobs Integration Tests', () => {
    let workerToken: string;
    let employerToken: string;

    beforeAll(() => {
        workerToken = jwt.sign({ id: 'worker_1', role: 'WORKER' }, process.env.JWT_ACCESS_SECRET || 'fallback_secret_for_dev_min_64_chars', { expiresIn: '1h' });
        employerToken = jwt.sign({ id: 'employer_1', role: 'EMPLOYER' }, process.env.JWT_ACCESS_SECRET || 'fallback_secret_for_dev_min_64_chars', { expiresIn: '1h' });
    });

    it('should allow workers to fetch available jobs', async () => {
        prismaMock.job.findMany.mockResolvedValue([
            { id: 'job_1', employerProfileId: 'emp_1', businessProfileId: null, title: 'Test Job', description: 'desc', category: 'Cleaning', skills: [], payPerWorker: 500, totalSpots: 2, filledSpots: 0, isPrefunded: false, prefundedAt: null, scheduledFor: new Date(), estimatedHours: 2, isInstant: false, city: 'Delhi', state: 'DL', address: '123 Test', latitude: 28.6, longitude: 77.2, status: 'ACTIVE', cancelledAt: null, cancelReason: null, completedAt: null, createdAt: new Date(), updatedAt: new Date() }
        ]);

        const response = await request(app)
            .get('/api/v1/jobs/available')
            .set('Authorization', `Bearer ${workerToken}`);

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body[0].title).toBe('Test Job');
    });

    it('should gracefully handle db failure when creating jobs', async () => {
        prismaMock.$transaction.mockRejectedValue(new Error("Database connection lost"));

        const response = await request(app)
            .post('/api/v1/jobs')
            .set('Authorization', `Bearer ${employerToken}`)
            .send({ title: 'New Job', employerProfileId: 'emp_1', payPerWorker: 100, totalSpots: 1 });

        expect(response.status).toBe(500);
        expect(response.body.error).toContain("Database connection lost");
    });
});
