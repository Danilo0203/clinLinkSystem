import api from '@/libs/utils';
import axiosInstance from '../utils/axiosConfig';

export const getAllAppointments = async () => {
    const response = await api.get('/api/appointment');
    return response.data;
};

export const getAppointmentById = async (id: string) => {
    const response = await axiosInstance.get(`/appointment/${id}`);
    return response.data;
};

export const createAppointment = async (appointmentData: any) => {
    const response = await axiosInstance.post('/appointment', appointmentData);
    return response.data;
};

export const updateAppointment = async (id: string, appointmentData: any) => {
    const response = await axiosInstance.put(`/appointment/${id}`, appointmentData);
    return response.data;
};

export const deleteAppointment = async (id: string) => {
    const response = await axiosInstance.delete(`/appointment/${id}`);
    return response.data;
};
