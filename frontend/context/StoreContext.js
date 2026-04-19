"use client"

import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import axios from 'axios';

const StoreContext = createContext();

export function StoreProvider({ children }) {
    const { isLoaded, userId, getToken } = useAuth();
    const [userRole, setUserRole] = useState(null); // 'USER' or 'ADMIN'
    const [dbUser, setDbUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUserRole = async () => {
        if (!userId) {
            setUserRole(null);
            setDbUser(null);
            setLoading(false);
            return;
        }

        try {
            const token = await getToken();
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
            
            const response = await axios.get(`${apiUrl}/api/users/sync`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            setUserRole(response.data.role);
            setDbUser(response.data);
        } catch (err) {
            console.error("Error fetching user role from context:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isLoaded) {
            fetchUserRole();
        }
    }, [isLoaded, userId]);

    return (
        <StoreContext.Provider value={{ 
            userRole, 
            dbUser, 
            loading, 
            isAdmin: userRole === 'ADMIN',
            refreshUser: fetchUserRole 
        }}>
            {children}
        </StoreContext.Provider>
    );
}

export const useStore = () => useContext(StoreContext);
