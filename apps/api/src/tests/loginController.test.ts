import app from '../app';

describe('User Login', () => {
    it('should return 400 if email or password is incorrect', async () => {
        prisma.user.findUnique = jest.fn().mockResolvedValue(null);

        const response = await request(app)
            .post('/login')
            .send({ email: 'nonexistent@example.com', password: 'wrongpassword' });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Invalid email or password');
    });

    it('should return 200 and JWT token if login is successful', async () => {
        const mockUser = {
            id: 1,
            email: 'test@example.com',
            password: await bcrypt.hash('password123', 10),
            name: 'Test User',
            role: 'user',
            referralCode: 'TEST1234',
        };
        const fakeJwt = 'fake-jwt-token';
        prisma.user.findUnique = jest.fn().mockResolvedValue(mockUser);
        // const jwtSignSpy = jest.spyOn(jwt, 'sign').mockReturnValue('fake-jwt-token');
        const jwtSignSpy = jest.mock('jsonwebtoken', () => ({
            ...jest.requireActual('jsonwebtoken'),
            sign: jest.fn().mockReturnValue('fake-jwt-token'), // Set return value for sign
        }));

        const response = await request(app)
            .post('/login')
            .send({ email: 'test@example.com', password: 'password123' });

        expect(response.status).toBe(200);
        expect(response.body.token).toBe('fake-jwt-token');
        expect(jwtSignSpy).toHaveBeenCalled();
    });
});