import api from '@/libs/utils';
import { DoctoresService } from './doctoresApi';

export const DoctoresDetalleService = {
    async getListar() {
        const res = await api.get('/api/doctor-detail');

        const resMedicos = await DoctoresService.getListarDoctores();

        const detalle = res.data.data.map((horario: any) => {
            const doctor = resMedicos.data.find((doc: any) => doc.id === horario.doctor_id);

            return { ...horario, doctor: doctor ? doctor.first_name : '' };
        });

        return {
            data: detalle,
            success: res.data.success,
            message: res.data.message
        };
    },

    async putActualizar(id: number, data: any) {
        const res = await api.put(`/api/doctor-detail/${id}`, data);
        return res.data;
    },
    async deleteEliminar(id: number | null) {
        const res = await api.delete(`/api/doctor-detail/${id}`);
        return res.data;
    },
    async postCrear(data: any) {
        const res = await api.post('/api/doctor-detail', data);
        return res.data;
    },

    // Paginacion de usuarios
    async getPaginacion(page: number, size: number) {
        const res = await api.get(`/api/doctor-detail?pagination=${size}&page=${page}`);
        return res.data;
    }
};
