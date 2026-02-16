import axios from 'axios';
import { useAuth } from '@clerk/clerk-expo';
import { useEffect } from 'react';
import * as Sentry from '@sentry/react-native';

const API_URL = 'http://192.168.1.183:3000/api';
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});

export const useApi = () => {
    const { getToken } = useAuth();

    useEffect(() => {
        const requestInterceptor = api.interceptors.request.use(async (config) => {
            const token = await getToken();
            if(token) {
                config.headers.Authorization = `Bearer ${token}`;
            }

            return config;
        });

        const responseInterceptor = api.interceptors.response.use(async (response) => response, (error) => {
            // log api errors to sentry
            if(error.response) {
                Sentry.logger.error(
                    Sentry.logger.fmt`API request failed: ${error.config?.method?.toUppercase()} ${ error.config?.url }`,
                    { 
                        status: error.response.status,
                        endpoing: error.config?.url,
                        method: error.config?.method,
                    }
                );
            } else if (error.request) {
                Sentry.logger.warn(
                    Sentry.logger.fmt`API request failed - no response`,
                    { 
                        status: error.response.status,
                        method: error.config?.method,
                    }
                );
            }

            return Promise.reject(error);
        });

        // Remove interceptors when component unmounts
        return () => {
            api.interceptors.request.eject(requestInterceptor);
            api.interceptors.response.eject(responseInterceptor);
        };
    }, [getToken]);

    return api;
}