// src/services/scheduleService.ts
import axiosInstance from '../utils/axiosConfig';

export const getAllSchedules = async () => {
    const response = await axiosInstance.get('/schedule');
    return response.data;
};

export const getScheduleById = async (id: string) => {
    const response = await axiosInstance.get(`/schedule/${id}`);
    return response.data;
};

export const createSchedule = async (scheduleData: any) => {
    const response = await axiosInstance.post('/schedule', scheduleData);
    return response.data;
};

export const updateSchedule = async (id: string, scheduleData: any) => {
    const response = await axiosInstance.put(`/schedule/${id}`, scheduleData);
    return response.data;
};

export const deleteSchedule = async (id: string) => {
    const response = await axiosInstance.delete(`/schedule/${id}`);
    return response.data;
};
