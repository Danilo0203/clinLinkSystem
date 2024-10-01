// src/services/doctorDetailService.ts
import axiosInstance from '../utils/axiosConfig';

export const getAllDoctorDetails = async () => {
    const response = await axiosInstance.get('/doctor-detail');
    return response.data;
};

export const getDoctorDetailById = async (id: string) => {
    const response = await axiosInstance.get(`/doctor-detail/${id}`);
    return response.data;
};

export const createDoctorDetail = async (doctorDetailData: any) => {
    const response = await axiosInstance.post('/doctor-detail', doctorDetailData);
    return response.data;
};

export const updateDoctorDetail = async (id: string, doctorDetailData: any) => {
    const response = await axiosInstance.put(`/doctor-detail/${id}`, doctorDetailData);
    return response.data;
};

export const deleteDoctorDetail = async (id: string) => {
    const response = await axiosInstance.delete(`/doctor-detail/${id}`);
    return response.data;
};
