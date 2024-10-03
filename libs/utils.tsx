import axios from 'axios';
import { getSession } from 'next-auth/react';

const api = axios.create({
    baseURL: 'https://clinclink-bf4bg.ondigitalocean.app/',
    headers: {
        Accept: 'application/json'
    }
});

api.interceptors.request.use(
    async (config) => {
        const session = await getSession();
        console.log(session);

        if (session) {
            // Si tienes el token en el objeto `session`
            if (session.user && typeof session.user !== 'string') {
                config.headers.Authorization = `Bearer ${(session.user as any).tokken}`;
            }
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
