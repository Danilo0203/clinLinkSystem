import api from '@/libs/utils';
import { DoctoresService } from '../doctores/doctoresApi';

export const HorariosService = {
    async getListarHorarios() {
        const res = await api.get('/api/schedule');
        const resMedicos = await DoctoresService.getListarDoctores();

        // Definir el arreglo con los nombres de los días de la semana
        const daysOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

        const horarios = res.data.data.map((horario: any) => {
            const doctor = resMedicos.data.find((doc: any) => doc.id === horario.doctor_id);

            // Obtener el nombre del día correspondiente
            const dayIndex = horario.day_of_week - 1; // Ajustar el índice ya que los arreglos empiezan en 0
            const dayName = daysOfWeek[dayIndex];

            return { ...horario, doctor: doctor ? doctor.first_name : '', day: dayName };
        });

        return {
            data: horarios,
            success: res.data.success,
            message: res.data.message
        };
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

    async getPaginacion(page: number, size: number) {
        const res = await api.get(`/api/schedule?pagination=${size}&page=${page}`);
        return res.data;
    }
};
