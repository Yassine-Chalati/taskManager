'use client';

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import taskService from '../../../../services/taskService'; // Import your task service
import { Task } from '../../../../types/task';  // Import your Task type

// Define Zod schema for validation
const taskSchema = z.object({
    title: z.string().min(3, "Title is required"),
    description: z.string().min(10, "Description is too short"),
    due_date: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid date format"),
    priority: z.enum(["high", "medium", "low"]),
    status: z.enum(["pending", "in-progress", "completed"]),
});

type TaskFormValues = z.infer<typeof taskSchema>;

const TaskForm = () => {
    const [isTaskCreated, setIsTaskCreated] = useState(false);
    const [isTaskFailed, setIsTaskFailed] = useState(false); // For failure pop-up
    const [isLoading, setIsLoading] = useState(false); // For showing loading state
    const router = useRouter();

    // Use React Hook Form with Zod validation
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<TaskFormValues>({
        resolver: zodResolver(taskSchema),
    });

    // Handle form submission
    const onSubmit = async (data: TaskFormValues) => {
        setIsLoading(true); // Start loading
        setIsTaskCreated(false); // Reset any previous success message
        setIsTaskFailed(false); // Reset any previous failure message

        try {
            const newTask: Task = {
                id: 0, // Generate a unique ID (numeric string)
                title: data.title,
                priority: data.priority, // Use the selected priority from the form
                description: data.description,
                due_date: data.due_date,
                status: data.status, // Ensure the status is sent as 'pending', 'in-progress', or 'completed'
                createdAt: new Date().toISOString(), // Current date in ISO 8601 format
                updatedAt: new Date().toISOString(), // Current date in ISO 8601 format
            };

            // Call the createTask method from taskService
            await taskService.createTask(newTask);

            // If successful, show the success message
            setIsTaskCreated(true);
            reset(); // Reset form after creation
            setTimeout(() => {
                setIsTaskCreated(false);
                router.push("/tasks"); // Redirect to the task list page after creation
            }, 3000); // Hide success after 3 seconds
        } catch (error) {
            console.error("Error creating task:", error);
            setIsTaskFailed(true); // Show failure message
        } finally {
            setIsLoading(false); // Stop loading spinner
        }
    };

    return (
        <motion.div
            className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6 flex justify-center items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="max-w-lg w-full p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                <motion.h2
                    className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    Create New Task
                </motion.h2>

                {/* Task Creation Form */}
                <form onSubmit={handleSubmit(onSubmit)}>
                    {/* Title Field */}
                    <motion.input
                        type="text"
                        {...register("title")}
                        placeholder="Task Title"
                        className="w-full p-2 mb-4 border border-gray-300 dark:border-gray-700 rounded-md dark:bg-gray-700 dark:text-white"
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    />
                    {errors.title && <p className="text-red-500">{errors.title.message}</p>}

                    {/* Description Field */}
                    <motion.textarea
                        {...register("description")}
                        placeholder="Task Description"
                        className="w-full p-2 mb-4 border border-gray-300 dark:border-gray-700 rounded-md dark:bg-gray-700 dark:text-white"
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    />
                    {errors.description && <p className="text-red-500">{errors.description.message}</p>}

                    {/* Due Date and Priority Fields */}
                    <div className="flex justify-between mb-4">
                        <motion.input
                            type="date"
                            {...register("due_date")}
                            className="p-2 border border-gray-300 dark:border-gray-700 rounded-md dark:bg-gray-700 dark:text-white"
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.5 }}
                        />
                        {errors.due_date && <p className="text-red-500">{errors.due_date.message}</p>}

                        <motion.select
                            {...register("priority")}
                            className="p-2 border border-gray-300 dark:border-gray-700 rounded-md dark:bg-gray-700 dark:text-white"
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <option value="high">High Priority</option>
                            <option value="medium">Medium Priority</option>
                            <option value="low">Low Priority</option>
                        </motion.select>
                    </div>

                    {/* Status Field */}
                    <motion.select
                        {...register("status")}
                        className="w-full p-2 mb-4 border border-gray-300 dark:border-gray-700 rounded-md dark:bg-gray-700 dark:text-white"
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <option value="pending">Pending</option>
                        <option value="in-progress">In-Progress</option>
                        <option value="completed">Completed</option>
                    </motion.select>
                    {errors.status && <p className="text-red-500">{errors.status.message}</p>}

                    {/* Submit Button */}
                    <motion.button
                        type="submit"
                        className="w-full bg-blue-500 text-white p-2 rounded-md"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        {isLoading ? "Loading..." : "Create Task"}
                    </motion.button>
                </form>

                {/* Success message after task creation */}
                {isTaskCreated && (
                    <motion.div
                        className="mt-4 p-4 bg-green-100 text-green-700 rounded-md"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        Task Created Successfully!
                    </motion.div>
                )}

                {/* Failure message when task creation fails */}
                {isTaskFailed && (
                    <motion.div
                        className="mt-4 p-4 bg-red-100 text-red-700 rounded-md"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        Task Creation Failed! Please try again.
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
};

export default TaskForm;
