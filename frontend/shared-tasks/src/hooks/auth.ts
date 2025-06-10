// hooks/useAuth.ts
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    useEffect(() => {
        const token = Cookies.get('access_token'); // or localStorage.getItem('access_token')
        setIsAuthenticated(!!token);
    }, []);

    return { isAuthenticated };
};

export default useAuth;
