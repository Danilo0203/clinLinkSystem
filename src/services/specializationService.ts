// src/services/specializationService.ts
import axiosInstance from '../utils/axiosConfig';

export const getAllSpecializations = async () => {
    const response = await axiosInstance.get('/specialization');
    return response.data;
};

export const getSpecializationById = async (id: string) => {
    const response = await axiosInstance.get(`/specialization/${id}`);
    return response.data;
};

export const createSpecialization = async (specializationData: any) => {
    const response = await axiosInstance.post('/specialization', specializationData);
    return response.data;
};

export const updateSpecialization = async (id: string, specializationData: any) => {
    const response = await axiosInstance.put(`/specialization/${id}`, specializationData);
    return response.data;
};

export const deleteSpecialization = async (id: string) => {
    const response = await axiosInstance.delete(`/specialization/${id}`);
    return response.data;
};
