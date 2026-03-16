import axios from 'axios';
import { getAuthHeaders } from '../utils/requestHeader';


const api = axios.create({
    // We fallback to '/api-proxy' if the env variable is missing to prevent 404s
    baseURL: import.meta.env.VITE_BASE_URL || '/api-proxy',
    timeout: 10000,
    withCredentials: true,
});

/**
 * REQUEST INTERCEPTOR
 * * This runs before every single request. It attaches the required 
 * mobile-app headers and security timestamps.
 */
api.interceptors.request.use(
    (config) => {
        // 1. Fetch metadata headers from your utility file
        const metadata = getAuthHeaders();
        
        // 2. Define the mandatory source and timestamp headers
        const sourceValue = import.meta.env.VITE_SOURCE || 'MOB';
        const timestamp = Date.now().toString();

        // 3. Merge all headers into the config
        // We explicitly set 'source' and 'x-source' because different 
        // endpoints on your backend might look for different keys.
        config.headers = {
            ...config.headers,
            ...metadata,
            'deviceId': import.meta.env.VITE_DEVICE_ID || 'your_default_id',
            'source': sourceValue,
            'x-source': sourceValue,
            'x-timestamp': timestamp,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        } as any;

        // DEBUG: This helps you see the actual path being requested in the console
        if (import.meta.env.DEV) {
            console.log(`🚀 Requesting: ${config.baseURL}${config.url}`);
            console.log(`🛠️ Headers:`, config.headers);
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

/**
 * RESPONSE INTERCEPTOR (Optional but Recommended)
 * * Useful for catching global errors like 401 Unauthorized 
 * to redirect users back to the login page.
 */
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const message = error.response?.data?.message || "Network Error";
        console.error("❌ API Error:", message);
        return Promise.reject(error);
    }
);

export default api;