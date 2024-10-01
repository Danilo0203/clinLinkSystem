'use client';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { InputNumber, InputNumberValueChangeEvent } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import React, { useEffect, useRef, useState } from 'react';
// import 'react-datepicker/dist/react-datepicker.css';
import AppointmentTable from '../reservas/components/AppointmentTable';
import { Calendar } from 'primereact/calendar';
import { Nullable } from 'primereact/ts-helpers';
export default function PageReservas() {
    interface Appointment {
        id: number;
        room_id: number | null;
        appointment_status_id: number | null;
        patient_id: number | null;
        doctor_id: number | null;
        appointment_date: string;
        start_timestamp: string;
        end_timestamp: string;
    }

    const [appointments, setAppointments] = useState<Appointment[]>([
        { id: 1, room_id: 101, appointment_status_id: 1, patient_id: 201, doctor_id: 301, appointment_date: '2024-09-26', start_timestamp: '09:00', end_timestamp: '10:00' },
        { id: 2, room_id: 102, appointment_status_id: 2, patient_id: 202, doctor_id: 302, appointment_date: '2024-09-27', start_timestamp: '10:00', end_timestamp: '11:00' }
    ]);

    const [newAppointmentDialog, setNewAppointmentDialog] = useState(false);
    const [appointment, setAppointment] = useState<Appointment | null>(null);
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);

    useEffect(() => {}, []);

    const openNew = () => {
        setAppointment({
            id: 0,
            room_id: 0,
            appointment_status_id: 0,
            patient_id: 0,
            doctor_id: 0,
            appointment_date: '',
            start_timestamp: '',
            end_timestamp: ''
        });
        setNewAppointmentDialog(true);
    };
    const isAppointmentConflict = (newAppointment: Appointment, appointments: Appointment[]): boolean => {
        return appointments.some((appointment) => appointment.doctor_id === newAppointment.doctor_id && appointment.appointment_date === newAppointment.appointment_date && appointment.start_timestamp === newAppointment.start_timestamp);
    };
    const saveNewAppointment = (newAppointment: Appointment) => {
        if (isAppointmentConflict(newAppointment, appointments)) {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'There is already an appointment with this doctor at the same time.',
                life: 3000
            });
            return;
        }

        setAppointments([...appointments, { ...newAppointment, id: appointments.length + 1 }]);
        setNewAppointmentDialog(false);
        setAppointment(null);
        toast.current?.show({
            severity: 'success',
            summary: 'Successful',
            detail: 'Appointment Created',
            life: 3000
        });
    };
    const newAppointmentDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={() => setNewAppointmentDialog(false)} />
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={() => appointment && saveNewAppointment(appointment)} />
        </>
    );
    const createId = () => {
        let id = '';
        let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    };

    const exportCSV = () => {
        dt.current?.exportCSV();
    };
    const leftToolbarTemplate = () => {
        return (
            <div className="my-2">
                <Button label="Nuevo" icon="pi pi-plus" severity="success" className=" mr-2" onClick={openNew} />
            </div>
        );
    };
    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                {/* <FileUpload mode="basic" accept="image/*" maxFileSize={1000000} chooseLabel="Importar" className="mr-2 inline-block" /> */}
                <Button label="Exportar" icon="pi pi-upload" severity="help" onClick={exportCSV} />
            </React.Fragment>
        );
    };
    // Arreglar el error de busqueda de tabla
    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Horarios</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                {/*                 <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder="Buscar..." />
                 */}{' '}
            </span>
        </div>
    );
    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" end={leftToolbarTemplate} start={rightToolbarTemplate}></Toolbar>

                    <div>
                        <h1>Reserva de Citas</h1>
                        <AppointmentTable appointments={appointments} setAppointments={setAppointments} />
                        <Dialog visible={newAppointmentDialog} style={{ width: '450px' }} header="New Appointment" modal className="p-fluid" footer={newAppointmentDialogFooter} onHide={() => setNewAppointmentDialog(false)}>
                            {appointment && (
                                <>
                                    <div className="field">
                                        <label htmlFor="room_id">Sala</label>
                                        <InputNumber id="room_id" value={appointment.room_id ?? 0} onValueChange={(e) => setAppointment({ ...appointment, room_id: e.value ?? 0 })} required autoFocus />
                                    </div>
                                    <div className="field">
                                        <label htmlFor="appointment_status_id">Estado</label>
                                        <InputNumber id="appointment_status_id" value={appointment.appointment_status_id ?? 0} onValueChange={(e) => setAppointment({ ...appointment, appointment_status_id: e.value ?? 0 })} required />
                                    </div>
                                    <div className="field">
                                        <label htmlFor="patient_id">Paciente</label>
                                        <InputNumber id="patient_id" value={appointment.patient_id} onValueChange={(e) => setAppointment({ ...appointment, patient_id: e.value ?? 0 })} required />
                                    </div>
                                    <div className="field">
                                        <label htmlFor="doctor_id">Doctor </label>
                                        <InputNumber id="doctor_id" value={appointment.doctor_id} onValueChange={(e) => setAppointment({ ...appointment, doctor_id: e.value ?? 0 })} required />
                                    </div>
                                    <div className="field">
                                        <label htmlFor="appointment_date">Fecha de Citas</label>
                                        <InputText type="date" id="appointment_date" value={appointment.appointment_date} onChange={(e) => setAppointment({ ...appointment, appointment_date: e.target.value })} required />
                                    </div>
                                    <div className="field">
                                        <label htmlFor="start_timestamp">Hora de Inicio</label>
                                        <InputText type="time" id="start_timestamp" value={appointment.start_timestamp} onChange={(e) => setAppointment({ ...appointment, start_timestamp: e.target.value })} required />
                                    </div>
                                    <div className="field">
                                        <label htmlFor="end_timestamp">Hora Final</label>
                                        <InputText type="time" id="end_timestamp" value={appointment.end_timestamp} onChange={(e) => setAppointment({ ...appointment, end_timestamp: e.target.value })} required />
                                    </div>
                                </>
                            )}
                        </Dialog>
                    </div>
                </div>
            </div>
        </div>
    );
}
