// tests/taskRoutes.test.js
const request = require('supertest');
const app = require('../app');  // Import the app from app.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const axios = require('axios');


describe('Task API', () => {
    let taskId;  // Store taskId for subsequent tests
    let jwtToken; 


    beforeAll(async () => {
        // Obtain JWT token from Keycloak
        const tokenResponse = await axios.post('http://69.62.106.98:9001/realms/Chalati%20/protocol/openid-connect/token',
        new URLSearchParams({
            client_id: 'Chalati-Mini-Application',
            username: 'test',
            password: 'test',
            grant_type: 'password'
        }),
        {
            headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
            }
        }
        );
        jwtToken = tokenResponse.data.access_token;  // Store the JWT token

        // Optionally, you can clear the tasks table before running tests
        await prisma.task.deleteMany({});
    });

    afterAll(async () => {
        // Clean up the database after tests
        await prisma.task.deleteMany({});
        await prisma.$disconnect();
    });


    // Test case: Get all tasks (empty initially)
    it('should fetch all tasks', async () => {
        const res = await request(app)
            .get('/api/tasks')
            .set('Authorization', `Bearer ${jwtToken}`);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBe(0);  // Assuming no tasks are created initially
    });

    // Test case: Create a new task
    it('should create a new task', async () => {
        const task = {
        title: 'Complete Project',
        priority: 'high',
        description: 'Finish the final project for the task management application.',
        due_date: '2025-06-30T23:59:59.000Z',
        status: 'pending',
        };

        const res = await request(app)
            .post('/api/tasks').send(task)
            .set('Authorization', `Bearer ${jwtToken}`);
        expect(res.status).toBe(201);
        expect(res.body.title).toBe(task.title);
        expect(res.body.priority).toBe(task.priority);
        expect(res.body.description).toBe(task.description);
        expect(res.body.status).toBe(task.status);
        expect(res.body.due_date).toBe(task.due_date);

        taskId = res.body.id;  // Save the created task id for later tests
    });

    // Test case: Get task by ID
    it('should fetch task by ID', async () => {
        const res = await request(app)
            .get(`/api/tasks/${taskId}`)
            .set('Authorization', `Bearer ${jwtToken}`);
        expect(res.status).toBe(200);
        expect(res.body.id).toBe(taskId);
        expect(res.body.title).toBe('Complete Project');
    });

    // Test case: Try to get a task that doesn't exist
    it('should return 404 for a non-existent task', async () => {
        const res = await request(app)
            .get('/api/tasks/9999')
            .set('Authorization', `Bearer ${jwtToken}`);
        expect(res.status).toBe(404);
        expect(res.body.message).toBe('Task not found');
    });

    // Test case: Update task
    it('should update the task', async () => {
        const updatedTask = {
        title: 'Complete Project - Updated',
        priority: 'high',
        description: 'Finish the project and add final features.',
        due_date: '2025-07-01T23:59:59.000Z',
        status: 'in-progress',
        };

        const res = await request(app)
            .put(`/api/tasks/${taskId}`)
            .set('Authorization', `Bearer ${jwtToken}`)
            .send(updatedTask);
        expect(res.status).toBe(200);
        expect(res.body.title).toBe(updatedTask.title);
        expect(res.body.priority).toBe(updatedTask.priority);
        expect(res.body.description).toBe(updatedTask.description);
        expect(res.body.due_date).toBe(updatedTask.due_date);
        expect(res.body.status).toBe(updatedTask.status);
    });

    // Test case: Delete task
    it('should delete the task', async () => {
        const res = await request(app)
            .delete(`/api/tasks/${taskId}`)
            .set('Authorization', `Bearer ${jwtToken}`);
        expect(res.status).toBe(204);  // No content after deletion

        // Verify task deletion by trying to fetch it again
        const verifyRes = await request(app)
            .get(`/api/tasks/${taskId}`)
            .set('Authorization', `Bearer ${jwtToken}`);
        expect(verifyRes.status).toBe(404);
    });

    // Test case: Validation failure for creating a task with missing fields
    it('should return validation error if required fields are missing', async () => {
        const invalidTask = {
        title: '',
        priority: '',  // Invalid priority
        description: '',
        due_date: '',
        status: 'pending',
        };

        const res = await request(app)
            .post('/api/tasks')
            .set('Authorization', `Bearer ${jwtToken}`)
            .send(invalidTask);
        expect(res.status).toBe(400);  // Bad request due to validation failure
        expect(res.body.errors).toHaveLength(3);  // Assuming there are 3 validation errors for missing fields
    });
});
