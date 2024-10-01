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
    deleted_at: null;
    created_at: Date;
    updated_at: Date;
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
}
