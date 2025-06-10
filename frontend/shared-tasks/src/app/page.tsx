'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import authenticationService from '@/services/authenticationService';
import { useRouter } from 'next/navigation';

// Dark mode toggle function
const toggleDarkMode = () => {
  document.documentElement.classList.toggle('dark');
};

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check if the user is already authenticated
    setError(null);
  }, [username, password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // You would typically call an API to authenticate the user here
    if (!username || !password) {
      setError('Username and password are required');
      return;
    }

    // Simulate a login API call with SWR or react-query
    authenticationService.loginUser({ username, password })
      .then((success) => {
        if (success) {
          setError(null);
          // Redirect to the dashboard or home page
          router.replace('/tasks'); // Adjust the path as needed
        } else {
          setError('Invalid username or password');
        }
      })
    // Use SWR or react-query to cache authentication state
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
      <div className="w-full max-w-sm p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-6"
        >
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Login</h2>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="text-left mb-6"
            >
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Username
              </label>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2 }}
              className="text-left mb-6"
            >
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
                required
              />
            </motion.div>
          </div>

          <div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="text-left mb-6"
            >
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Password
              </label>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2 }}
              className="text-left mb-6"
            >
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
                required
              />
            </motion.div>
            
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2 }}
              className="text-left mb-6"
            >
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="w-full py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
                >
                  Login
                </button>
              </div>
            </motion.div>
        </form>
        
      </div>
    </div>
  );
};

export default LoginPage;
