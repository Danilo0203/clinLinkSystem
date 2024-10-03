import api from '@/libs/utils';

export const DoctoresService = {
    async getListarDoctores() {
        const res = await api.get('/api/user');
        // Filtrar usuarios que tienen el rol de "medico"
        const doctores = res.data.data.filter((user: any) => user.role && user.role.name === 'medico');
        return { success: res.data.success, data: doctores, message: res.data.message };
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
        // Filtrar usuarios con rol de "medico"
        const doctores = res.data.data.filter((user: any) => user.role && user.role.name === 'medico');
        return { ...res.data, data: doctores };
    }
};
