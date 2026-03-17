import type { InternalAxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';
import api from './axios'; // Import the instance you just made
import { getAuthHeaders } from '../utils/requestHeader';

/**
 * REQUEST INTERCEPTOR
 */
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const metadata = getAuthHeaders();
        const token = Cookies.get('bearer_token');
        const sourceValue = import.meta.env.VITE_SOURCE || 'MOB';

        config.headers = {
            ...config.headers,
            ...metadata,
            'Authorization': token ? `Bearer ${token}` : '',
            'deviceId': import.meta.env.VITE_DEVICE_ID || 'your_default_id',
            'devicePublicKey': import.meta.env.VITE_DEVICE_PUBLIC_KEY,
            'source': sourceValue,
            'x-source': sourceValue,
            'x-timestamp': Date.now().toString(),
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        } as any;

        return config;
    },
    (error) => Promise.reject(error)
);

/**
 * RESPONSE INTERCEPTOR
 */
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            Cookies.remove('bearer_token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);