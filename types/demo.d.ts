/* FullCalendar Types */
import { EventApi, EventInput } from '@fullcalendar/core';

/* Chart.js Types */
import { ChartData, ChartOptions } from 'chart.js';

export interface UsuariosProps {
    success: boolean;
    data: Data;
    message: string;
}

export interface Data {
    current_page: number;
    data: Datum;
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: Link[];
    next_page_url: string;
    path: string;
    per_page: number;
    prev_page_url: string;
    to: number;
    total: number;
}

export interface Datum {
    id: number;
    role_id: number;
    first_name: string;
    last_name: string;
    username: string;
    email: string;
    phone_number: string;
    date_of_birth: Date;
    profile_picture_uri: null;
    created_at: Date;
    updated_at: Date;
    deleted_at: null;
    role: Role;
    moduleUserPermissions: any[];
    doctorDetail: null;
}

export interface Role {
    id: number;
    name: string;
}

export interface Link {
    url: string;
    label: string;
    active: boolean;
}
export interface UsuarioProp {
    id: null;
    role_id: null;
    first_name: string;
    last_name: string;
    username: string;
    email: string;
    password: string;
    password_confirmation: string;
    phone_number: string;
    date_of_birth: string;
    role: Role;
}
export interface HorariosProps {
    success: boolean;
    data: DataHorarios;
    message: string;
}

export interface DataHorarios {
    id: number | null;
    doctor_id: number | null;
    day_of_week: number | null;
    time_start: Date | string;
    time_end: Date | string;
    doctor?: string;
    day?: string;
}
export interface DetallesDoctoresProps {
    success: boolean;
    data: Datum[];
    message: string;
}

export interface DetalleDoctor {
    id: number | null;
    doctor_id: number | null;
    doctor: string;
    license_number: number | null;
    years_of_experience: number | null;
}
export interface EspecializacionProps {
    success: boolean;
    data: Data;
    message: string;
}

export interface DataEspecializacionProps {
    id: number | null;
    name: string;
}
export interface ReservarProps {
    success: boolean;
    data: Data;
    message: string;
}

export interface Data {
    current_page: number;
    data: DataReserva[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: Link[];
    next_page_url: null;
    path: string;
    per_page: number;
    prev_page_url: null;
    to: number;
    total: number;
}

export interface DataReserva {
    id: number | null | string;
    room_id: number | null | string;
    appointment_status_id: number | null | string;
    patient_id: number | null | string;
    doctor_id: number | null | string;
    start_timestamp: Date | null;
    end_timestamp: Date | null;
}

export interface Link {
    url: null | string;
    label: string;
    active: boolean;
}
