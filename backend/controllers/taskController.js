// controllers/taskController.js
const taskService = require('../services/taskService');

// Get all tasks
exports.getAllTasks = async (req, res) => {
    try {
        const tasks = await taskService.getAllTasks();
        res.status(200).json(tasks); // Return TaskModel instances
    } catch (error) {
        res.status(500).json({ message: 'Error fetching tasks', error: error.message });
    }
};

// Get task by ID
exports.getTaskById = async (req, res) => {
    const { id } = req.params;
    try {
        const task = await taskService.getTaskById(id);
        if (!task) {
        return res.status(404).json({ message: 'Task not found' });
        }
        res.status(200).json(task); // Return the TaskModel instance
    } catch (error) {
        res.status(500).json({ message: 'Error fetching task', error: error.message });
    }
};

// Create a new task
exports.createTask = async (req, res) => {
    try {
        const task = await taskService.createTask(req.body);
        res.status(201).json(task); // Return the created TaskModel instance
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ message: 'Error creating task', error: error.message });
    }
};

// Update a task
exports.updateTask = async (req, res) => {
    const { id } = req.params;
    try {
        const task = await taskService.updateTask(id, req.body);
        res.status(200).json(task); // Return the updated TaskModel instance
    } catch (error) {
        res.status(500).json({ message: 'Error updating task', error: error.message });
    }
};

// Delete a task
exports.deleteTask = async (req, res) => {
    const { id } = req.params;
    try {
        await taskService.deleteTask(id);
        res.status(204).send(); // Return status 204 (No Content) after deletion
    } catch (error) {
        res.status(500).json({ message: 'Error deleting task', error: error.message });
    }
};
