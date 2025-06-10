'use client';

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import taskService from "../../../../../services/taskService";
import { Task } from "../../../../../types/task";
import useSWR from "swr";

// Zod schema
const taskSchema = z.object({
    title: z.string().min(3, "Title is required"),
    description: z.string().min(10, "Description is too short"),
    due_date: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid date format"),
    priority: z.enum(["high", "medium", "low"]),
    status: z.enum(["pending", "in-progress", "completed"]),
});

type TaskFormValues = z.infer<typeof taskSchema>;

// SWR fetcher
const fetchTask = async (taskId: number) => {
    const task = await taskService.getTaskById(taskId);
    if (!task || Array.isArray(task)) throw new Error("Invalid task data");
    return task;
};

const TaskForm = ({ params }: { params: Promise<{ taskid: number }> }) => {
    const { taskid } = React.use(params);
    const router = useRouter();

    const { data: task, error, isLoading: isTaskLoading } = useSWR(`${taskid}`, () => fetchTask(taskid));

    const [isTaskUpdated, setIsTaskUpdated] = useState(false);
    const [isTaskFailed, setIsTaskFailed] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<TaskFormValues>({
        resolver: zodResolver(taskSchema),
    });

    // ✅ Populate form with task data once loaded
    useEffect(() => {
        if (task) {
            reset({
                title: task.title,
                description: task.description,
                due_date: task.due_date.slice(0, 10), // Convert to yyyy-mm-dd
                priority: task.priority as "high" | "medium" | "low",
                status: task.status as "pending" | "in-progress" | "completed",
            });
        }
    }, [task, reset]);

    const onSubmit = async (data: TaskFormValues) => {
        setIsLoading(true);
        setIsTaskUpdated(false);
        setIsTaskFailed(false);

        if (!task) {
            setIsTaskFailed(true);
            setIsLoading(false);
            return;
        }

        try {
            const updatedTask: Task = {
                ...task,
                id: task.id as number,
                title: data.title,
                priority: data.priority,
                description: data.description,
                due_date: new Date(data.due_date).toISOString(),
                status: data.status,
                updatedAt: new Date().toISOString(),
                createdAt: task.createdAt,
            };

            await taskService.updateTask(updatedTask);

            setIsTaskUpdated(true);
            setTimeout(() => {
                setIsTaskUpdated(false);
                router.push("/tasks");
            }, 3000);
        } catch (error) {
            console.error("Error updating task:", error);
            setIsTaskFailed(true);
        } finally {
            setIsLoading(false);
        }
    };

    if (error) return <p className="text-red-500 text-center">Error loading task</p>;

    if (isTaskLoading || !task) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

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
                    Update Task
                </motion.h2>

                <form onSubmit={handleSubmit(onSubmit)}>
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

                    <motion.textarea
                        {...register("description")}
                        placeholder="Task Description"
                        className="w-full p-2 mb-4 border border-gray-300 dark:border-gray-700 rounded-md dark:bg-gray-700 dark:text-white"
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    />
                    {errors.description && <p className="text-red-500">{errors.description.message}</p>}

                    <div className="flex justify-between mb-4">
                        <motion.input
                            type="date"
                            {...register("due_date")}
                            className="p-2 border border-gray-300 dark:border-gray-700 rounded-md dark:bg-gray-700 dark:text-white"
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.5 }}
                        />
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
                    {errors.due_date && <p className="text-red-500">{errors.due_date.message}</p>}

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

                    <motion.button
                        type="submit"
                        className="w-full bg-blue-500 text-white p-2 rounded-md"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        {isLoading ? "Updating..." : "Update Task"}
                    </motion.button>
                </form>

                {isTaskUpdated && (
                    <motion.div className="mt-4 p-4 bg-green-100 text-green-700 rounded-md" animate={{ opacity: 1 }}>
                        Task Updated Successfully!
                    </motion.div>
                )}
                {isTaskFailed && (
                    <motion.div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md" animate={{ opacity: 1 }}>
                        Task Update Failed. Please try again.
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
};

export default TaskForm;
