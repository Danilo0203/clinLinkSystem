import api from '@/libs/utils';

export const RolesService = {
    async getListarRoles() {
        const res = await api.get('/api/user');
        return res.data;
    }
};
