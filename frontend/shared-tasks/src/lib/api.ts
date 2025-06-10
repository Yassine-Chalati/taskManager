import axios, { AxiosResponse } from 'axios';
import { Task } from '../types/task'; // Adjust the import path as necessary

// Load environment variables from the custom path ../lib/.env.local
// dotenv.config({ path: path.resolve(__dirname, '.env.local') });

class API {
    private API_URL: string;

    constructor() {
        // Get the API URL from the environment variable
        this.API_URL = process.env.KEYCLOAK_URL_AUTH || 'http://localhost:8000/api';  // Default to empty string if not defined
    }

  // Method to authenticate user and get the token
    public async getAllTasks(access_token: string): Promise<{ tasks: Task[] }> {
        if (!access_token) {
            throw new Error('Access token is required');
        }
        console.warn('Fetching tasks with access token:', access_token);

        try {
            const response: AxiosResponse = await axios.get(`${this.API_URL}/tasks`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access_token}`,
                    },
                });

                const tasks = response.data;  // Directly use response.data as an array of tasks
                if (Array.isArray(tasks) && tasks.length >= 0) {
                    return { tasks };
                } else {
                    throw new Error('Failed to fetch tasks or no tasks available');
                }
            } catch (error) {
                console.error('Error fetching tasks:', error);
                throw error;
            }
    }
        
    public async createTask(task: Task, access_token: string): Promise<Task> {
        if (!access_token) {
            throw new Error('Access token is required');
        }

        try {
            const response: AxiosResponse = await axios.post(`${this.API_URL}/tasks`,
                {
                    title: task.title,
                    priority: task.priority,
                    description: task.description,
                    due_date: task.due_date,
                    status: task.status
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${access_token}`,
                    },
                });

            const createdTask: Task = response.data;
            return createdTask;
        } catch (error) {
            console.error('Error creating task:', error);
            throw error;
        }
    }

    public async updateTask(taskId: number, task: Partial<Task>, access_token: string): Promise<Task> {
        if (!access_token) {
            throw new Error('Access token is required');
        }

        try {
            const response: AxiosResponse = await axios.put(`${this.API_URL}/tasks/${taskId}`, task, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access_token}`,
                },
            });

            const updatedTask: Task = response.data;
            return updatedTask;
        } catch (error) {
            console.error('Error updating task:', error);
            throw error;
        }
    }
    public async deleteTask(taskId: number, access_token: string): Promise<void> {
        if (!access_token) {
            throw new Error('Access token is required');
        }

        try {
            await axios.delete(`${this.API_URL}/tasks/${taskId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access_token}`,
                },
            });
        } catch (error) {
            console.error('Error deleting task:', error);
            throw error;
        }
    }
    public async getTaskById(taskId: number, access_token: string): Promise<Task> {
        if (!access_token) {
            throw new Error('Access token is required');
        }

        try {
            const response: AxiosResponse = await axios.get(`${this.API_URL}/tasks/${taskId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access_token}`,
                },
            });

            const task: Task = response.data;
            return task;
        } catch (error) {
            console.error('Error fetching task by ID:', error);
            throw error;
        }
    }
}

const api = new API();

export default api;

// You can export the class if needed
