// routes/taskRoutes.js
const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { validateTask } = require('../middlewares/validationMiddleware');

// Task routes
router.get('/', taskController.getAllTasks);
router.get('/:id', taskController.getTaskById);
router.post('/', validateTask, taskController.createTask); // Use validation middleware
router.put('/:id', validateTask, taskController.updateTask); // Use validation middleware
router.delete('/:id', taskController.deleteTask);

module.exports = router;
