import api from '@/libs/utils';

export const CalendarioService = {
    async getListar() {
        const res = await api.get('/api/schedule');
        return res.data;
    },

    async putActualizar(id: number, data: any) {
        const res = await api.put(`/api/schedule/${id}`, data);
        return res.data;
    },
    async deleteEliminar(id: number | null) {
        const res = await api.delete(`/api/schedule/${id}`);
        return res.data;
    },
    async postCrear(data: any) {
        const res = await api.post('/api/schedule', data);
        return res.data;
    },

    // Paginacion de usuarios
    async getPaginacion(page: number, size: number) {
        const res = await api.get(`/api/schedule?pagination=${size}&page=${page}`);
        return res.data;
    }
};
