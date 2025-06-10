"use client";

import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import useSWR from 'swr';  // Import SWR
import taskService from '../../../services/taskService'; // Import your task service
import Cookies from 'js-cookie';
import { Task } from '../../../types/task';  // Import your Task type
import { useRouter } from 'next/navigation';

// Fetcher function to use with SWR
const fetchTasks = async () => {
    const access_token = Cookies.get('access_token');
    if (!access_token) throw new Error('Access token is required');
    const response = await taskService.getAllTasks();
    if (!response || !Array.isArray(response)) {
        throw new Error('Failed to fetch tasks or no tasks available');
    }
    return response;  // Return tasks data
};


const TaskList = () => {
    const { data: tasks, error, isLoading } = useSWR('/api/tasks', fetchTasks);  // Use SWR to fetch tasks from TaskService
    const router = useRouter();

    const [expandedTask, setExpandedTask] = useState<number | null>(null);
    const [statusFilter, setStatusFilter] = useState('All');
    const [dueDateFilter, setDueDateFilter] = useState('');
    const [createdDateFilter, setCreatedDateFilter] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('priority');

    // Handle task details visibility
    const toggleTaskDetails = (taskId: number) => {
        setExpandedTask(expandedTask === taskId ? null : taskId); // Toggle task details
    };

    const editTask = (taskId: number) => {
        router.push(`/tasks/edit/${taskId}`);
    };

    const [deletingTaskId, setDeletingTaskId] = useState<number | null>(null);
    const [showSuccess, setShowSuccess] = useState(false);

    // Add delete logic here
    const deleteTask = async (taskId: number) => {

    setDeletingTaskId(taskId);
    try {
        await taskService.deleteTask(taskId);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
        console.error("Delete failed", error);
        alert("Failed to delete task.");
    } finally {
        setDeletingTaskId(null);
        location.reload(); // or useSWR mutate if you prefer
    }
};

    // Reset all filters
    const resetFilters = () => {
        setStatusFilter('All');
        setDueDateFilter('');
        setCreatedDateFilter('');
        setSearchQuery('');
    };

    // Filter tasks based on status, due date, created date, and search query
    const filteredTasks = tasks?.filter((task: Task) => {
        // Status filter
        if (statusFilter !== 'All' && task.status.toLowerCase() !== statusFilter.toLowerCase()) {
            return false;
        }

        // Due Date filter
        if (dueDateFilter && new Date(task.due_date).toLocaleDateString() !== new Date(dueDateFilter).toLocaleDateString()) {
            return false;
        }

        // Created Date filter
        if (createdDateFilter && new Date(task.createdAt).toLocaleDateString() !== new Date(createdDateFilter).toLocaleDateString()) {
            return false;
        }

        // Search query filter
        if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) {
            return false;
        }

        return true;
    });

    // Sort tasks based on selected criteria (priority, due date, or created date)
    const sortedTasks = filteredTasks?.sort((a: Task, b: Task) => {
        if (sortBy === 'priority') {
            const priorityOrder = { high: 1, medium: 2, low: 3 };
            return priorityOrder[a.priority as keyof typeof priorityOrder] - priorityOrder[b.priority as keyof typeof priorityOrder];
        } else if (sortBy === 'dueDate') {
            return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
        } else if (sortBy === 'createdDate') {
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
        return 0;
    });

    // Handle loading and error states
    useEffect(() => {
        if (error?.status === 401) {
            router.replace('/');
        }
    }, [error, router]);

    
    if (error) return <div>Error loading tasks {error.message}</div>;

    // Loading spinner when data is being fetched
    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
                <div className="spinner-border animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    // Navigate to the create task page
    const navigateToCreateTask = () => {
        router.replace('/tasks/create'); // This will route to the create task page
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4 relative">
            <AnimatePresence>
                {showSuccess && (
                    <motion.div
                        className="fixed top-20 right-10 bg-green-600 text-white px-4 py-2 rounded shadow-lg z-50"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.4 }}
                    >
                        Task deleted successfully!
                    </motion.div>
                )}
            </AnimatePresence>


            {/* Create Task Button */}
            <motion.button
                onClick={navigateToCreateTask} // Navigate to the create task page
                className="absolute top-4 right-10 bg-blue-500 text-white p-4 rounded-full shadow-lg"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
            >
                Create Task
            </motion.button>

            {/* Filters and Task List */}
            <div className="max-w-4xl w-full p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md z-0">
                <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-6">Tasks</h1>

                {/* Search Input */}
                <div className="mb-6">
                    <input
                        type="text"
                        placeholder="Search tasks by title..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 p-2 rounded-md w-full"
                    />
                </div>

                {/* Filter Section */}
                <div className="mb-6 flex flex-col md:flex-row justify-between items-center space-x-4">
                    {/* Status Filter */}
                    <div className="mb-4 md:mb-0">
                        <label htmlFor="status" className="block text-sm font-medium text-gray-800 dark:text-white">Filter by Status</label>
                        <select
                            id="status"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 p-2 rounded-md"
                        >
                            <option value="All">All Status</option>
                            <option value="Completed">Completed</option>
                            <option value="Pending">Pending</option>
                            <option value="In-Progress">In-Progress</option>
                        </select>
                    </div>

                    {/* Due Date Filter */}
                    <div className="mb-4 md:mb-0">
                        <label htmlFor="dueDate" className="block text-sm font-medium text-gray-800 dark:text-white">Filter by Due Date</label>
                        <input
                            type="date"
                            id="dueDate"
                            value={dueDateFilter}
                            onChange={(e) => setDueDateFilter(e.target.value)}
                            className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 p-2 rounded-md"
                        />
                    </div>

                    {/* Created Date Filter */}
                    <div className="mb-4 md:mb-0">
                        <label htmlFor="createdDate" className="block text-sm font-medium text-gray-800 dark:text-white">Filter by Created Date</label>
                        <input
                            type="date"
                            id="createdDate"
                            value={createdDateFilter}
                            onChange={(e) => setCreatedDateFilter(e.target.value)}
                            className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 p-2 rounded-md"
                        />
                    </div>

                    {/* Sorting Options */}
                    <div>
                        <label htmlFor="sortBy" className="block text-sm font-medium text-gray-800 dark:text-white">Sort by</label>
                        <select
                            id="sortBy"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 p-2 rounded-md"
                        >
                            <option value="priority">Priority</option>
                            <option value="dueDate">Due Date</option>
                            <option value="createdDate">Created Date</option>
                        </select>
                    </div>
                </div>

                {/* Reset Filters Button */}
                <button
                    onClick={resetFilters}
                    className="mb-4 bg-red-500 text-white p-2 rounded-md"
                >
                    Reset Filters
                </button>

                {/* Task List */}
                <motion.div
                    className="space-y-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {(sortedTasks ?? []).map((task) => (
                        <motion.div
                            key={task.id}
                            className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm cursor-pointer relative"
                            onClick={() => toggleTaskDetails(Number(task.id))}
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.3 }}
                            initial={{ opacity: 0, y: 20 }}  // Start with a slight offset for smoother entry
                            animate={{ opacity: 1, y: 0 }}  // Animate to full opacity and default position
                            exit={{ opacity: 0, y: 20 }}  // Exit with a slight offset down
                            transition={{ duration: 0.5 }}  // Smooth motion for appearance
                        >
                            <div className="flex justify-between">
                                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">{task.title}</h2>
                                <span className="text-sm text-gray-600 dark:text-gray-300">{new Date(task.due_date).toLocaleDateString()}</span>
                            </div>

                            {/* Task Status */}
                            <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                                Status: <span className={task.status === 'Completed' ? 'text-green-500' : task.status === 'In-Progress' ? 'text-yellow-500' : 'text-red-500'}>{task.status}</span>
                            </div>

                            {/* Task Priority */}
                            <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                                Priority: <span className={task.priority === 'high' ? 'text-red-500' : task.priority === 'medium' ? 'text-yellow-500' : 'text-green-500'}>{task.priority}</span>
                            </div>

                            {/* Expandable Details */}
                            <motion.div
                                className="md:block"
                                initial={{ height: 0, opacity: 0 }}
                                animate={{
                                    height: expandedTask === Number(task.id) ? 'auto' : 0,
                                    opacity: expandedTask === Number(task.id) ? 1 : 0,
                                }}
                                transition={{ duration: 0.5 }}
                            >
                                {expandedTask === Number(task.id) && (
                                    <motion.div
                                        className="mt-4 text-gray-600 dark:text-gray-300"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <p><strong>Description:</strong> {task.description}</p>
                                        <p><strong>Created At:</strong> {new Date(task.createdAt).toLocaleString()}</p>
                                        <p><strong>Updated At:</strong> {new Date(task.updatedAt).toLocaleString()}</p>
                                    </motion.div>
                                )}
                            </motion.div>

                            {/* Task Buttons */}
                            <div className="flex space-x-4 mt-4 absolute right-4 bottom-4 z-10">
                                <button
                                    onClick={(e) => { e.stopPropagation(); editTask(Number(task.id)); }}
                                    className="bg-yellow-500 text-white p-2 rounded-md"
                                >
                                    Edit
                                </button>

                                <button
                                    onClick={(e) => {
                                        // e.stopPropagation();
                                        deleteTask(Number(task.id));
                                    }}
                                    disabled={deletingTaskId === task.id}
                                    className="bg-red-500 text-white p-2 rounded-md flex items-center justify-center w-20"
                                >
                                    {deletingTaskId === task.id ? (
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        "Delete"
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
};

export default TaskList;
