import api from '@/libs/utils';

export const ReservasService = {
    async getListar() {
        const res = await api.get('/api/appointment');
        return res.data;
    },

    async putActualizar(id: number, data: any) {
        const res = await api.put(`/api/appointment/${id}`, data);
        return res.data;
    },
    async deleteEliminar(id: number | null) {
        const res = await api.delete(`/api/appointment/${id}`);
        return res.data;
    },
    async postCrear(data: any) {
        const res = await api.post('/api/appointment', data);
        return res.data;
    },

    // Paginacion de usuarios
    async getPaginacion(page: number, size: number) {
        const res = await api.get(`/api/appointment?pagination=${size}&page=${page}`);
        return res.data;
    }
};
