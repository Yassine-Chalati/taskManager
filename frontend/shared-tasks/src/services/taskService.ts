import dotenv from 'dotenv';
import path from 'path';
import api from '../lib/api';
import { Task } from '../types/task';
import Cookies from 'js-cookie';


// Load environment variables from the custom path ../lib/.env.local
dotenv.config({ path: path.resolve(__dirname, '../lib/.env.local') });

class TaskService {

    public async getAllTasks(): Promise<Task[]> {
        const access_token = Cookies.get('access_token');
        console.warn('hhhhhhhhhhhhhhhhhhhFetching tasks with access token:', access_token);
        if (!access_token) {
            throw new Error('Access token is required');
        }

        try {
            const response = await api.getAllTasks(access_token);
            return response.tasks;
        } catch (error) {
            console.error('Error fetching tasks:', error);
            throw error;
        }
    }
    public async createTask(task: Task): Promise<Task> {
        const access_token = Cookies.get('access_token');
        if (!access_token) {
            throw new Error('Access token is required');
        }

        try {
            const createdTask = await api.createTask(task, access_token);
            return createdTask;
        } catch (error) {
            console.error('Error creating task:', error);
            throw error;
        }
    }

    public async updateTask(task: Task): Promise<Task> {
        const access_token = Cookies.get('access_token');
        if (!access_token) {
            throw new Error('Access token is required');
        }

        try {
            const updatedTask = await api.updateTask(task.id, task, access_token);
            return updatedTask;
        } catch (error) {
            console.error('Error updating task:', error);
            throw error;
        }
    }
    public async deleteTask(taskId: number): Promise<void> {
        const access_token = Cookies.get('access_token');
        if (!access_token) {
            throw new Error('Access token is required');
        }

        try {
            await api.deleteTask(taskId, access_token);
        } catch (error) {
            console.error('Error deleting task:', error);
            throw error;
        }
    }

    public async getTaskById(taskId: number): Promise<Task> {
        const access_token = Cookies.get('access_token');
        if (!access_token) {
            throw new Error('Access token is required');
        }

        try {
            const task = await api.getTaskById(taskId, access_token);
            return task;
        } catch (error) {
            console.error('Error fetching task by ID:', error);
            throw error;
        }
    }

}

// Example usage
const taskService = new TaskService();

// You can export the class if needed
export default taskService;
