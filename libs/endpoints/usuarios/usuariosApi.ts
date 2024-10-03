import api from '@/libs/utils';

export const UsuariosService = {
    async getListarUsuarios() {
        const res = await api.get('/api/user');
        return res.data;
    },

    async putActualizar(id: number, data: any) {
        const res = await api.put(`/api/user/${id}`, data);
        return res.data;
    },
    async deleteEliminar(id: number | null) {
        const res = await api.delete(`/api/user/${id}`);
        return res.data;
    },
    async postCrear(data: any) {
        const res = await api.post('/api/user', data);
        return res.data;
    },

    // Paginacion de usuarios
    async getPaginacion(page: number, size: number) {
        const res = await api.get(`/api/user?pagination=${size}&page=${page}`);
        return res.data;
    }
};
