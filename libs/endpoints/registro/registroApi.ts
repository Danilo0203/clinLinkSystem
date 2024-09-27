import api from '@/libs/utils';

export const RegistroService = {
    async registro(data: any) {
        const res = await api.post('/api/register', data);
        return res.data;
    }
};
