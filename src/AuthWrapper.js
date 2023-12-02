import React, { useEffect } from 'react';
import axios from 'axios';

export default function AuthWrapper({ children }) {
    const refreshAccessToken = async () => {
        try {
            const response = await axios.post('https://backen-diplomado-51d51f42ca0d.herokuapp.com/api/token/refresh/', {
                refresh: localStorage.getItem('refreshToken'),
            });

            if (response.data.access) {
                localStorage.setItem('token', response.data.access);
            } else {
                console.error('Failed to refresh access token');
            }
        } catch (err) {
            console.error('Failed to refresh access token');
        }
    };

    // Refresca el token cada 15 minutos
    useEffect(() => {
        const intervalId = setInterval(refreshAccessToken, 5 * 60 * 1000);

        // Limpia el intervalo cuando el componente se desmonta
        return () => clearInterval(intervalId);
    }, []);

    return children;
}