import api from '@/libs/utils';

export const EspecializacionService = {
    async getListar() {
        const res = await api.get('/api/specialization');
        return res.data;
    },

    async putActualizar(id: number, data: any) {
        const res = await api.put(`/api/specialization/${id}`, data);
        return res.data;
    },
    async deleteEliminar(id: number | null) {
        const res = await api.delete(`/api/specialization/${id}`);
        return res.data;
    },
    async postCrear(data: any) {
        const res = await api.post('/api/specialization', data);
        return res.data;
    },

    async getPaginacion(page: number, size: number) {
        const res = await api.get(`/api/specialization?pagination=${size}&page=${page}`);
        return res.data;
    }
};
