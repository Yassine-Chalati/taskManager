// services/taskService.js
const { PrismaClient } = require('@prisma/client');
const Prisma = new PrismaClient();
const TaskModel = require('../models/taskModel');  // Import TaskModel

// Service methods to handle task CRUD operations

exports.getAllTasks = async () => {
    const tasks = await Prisma.task.findMany();
    
    // Map the Prisma results to TaskModel instances
    return tasks.map(task => new TaskModel(
        task.id,
        task.title,
        task.priority,
        task.description,
        task.due_date,
        task.status,
        task.createdAt,
        task.updatedAt
    ));
};

exports.getTaskById = async (id) => {
    const task = await Prisma.task.findUnique({
        where: { id: Number(id) }
    });

  // If no task is found, return null
    if (!task) {
        return null;
    }

    // Return a TaskModel instance
    return new TaskModel(
        task.id,
        task.title,
        task.priority,
        task.description,
        task.due_date,
        task.status,
        task.createdAt,
        task.updatedAt
    );
};

exports.createTask = async (taskData) => {
    const task = await Prisma.task.create({
        data: taskData
    });

    // Return a TaskModel instance
    return new TaskModel(
        task.id,
        task.title,
        task.priority,
        task.description,
        task.due_date,
        task.status,
        task.createdAt,
        task.updatedAt
    );
};

exports.updateTask = async (id, taskData) => {
    const task = await Prisma.task.update({
        where: { id: Number(id) },
        data: taskData
    });

    // Return a TaskModel instance
    return new TaskModel(
        task.id,
        task.title,
        task.priority,
        task.description,
        task.due_date,
        task.status,
        task.createdAt,
        task.updatedAt
    );
};

exports.deleteTask = async (id) => {
    const task = await Prisma.task.delete({
        where: { id: Number(id) }
    });

    // Return a TaskModel instance after deletion (optional)
    return new TaskModel(
        task.id,
        task.title,
        task.priority,
        task.description,
        task.due_date,
        task.status,
        task.createdAt,
        task.updatedAt
    );
};
