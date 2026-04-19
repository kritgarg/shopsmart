"use client"

import { useAuth } from "@clerk/nextjs";
import { useEffect } from "react";
import axios from "axios";

export default function SyncUser() {
    const { isLoaded, userId, getToken } = useAuth();

    useEffect(() => {
        const sync = async () => {
            if (!userId) return;
            try {
                const token = await getToken();
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
                
                // Pinging the sync endpoint will trigger the backend middleware sync logic
                await axios.get(`${apiUrl}/api/users/sync`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                console.log("User synchronized with database");
            } catch (err) {
                console.error("Failed to sync user:", err.message);
            }
        };

        if (isLoaded && userId) {
            sync();
        }
    }, [isLoaded, userId, getToken]);

    return null; // This component doesn't render anything
}
