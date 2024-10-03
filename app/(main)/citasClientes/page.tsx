'use client';
import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Calendar } from 'primereact/calendar';
import { Toast } from 'primereact/toast';
import { getAllAppointments, createAppointment, deleteAppointment, updateAppointment } from '../../../src/services/appointmentService';
import api from '@/libs/utils';
import { CalendarioService } from '@/libs/endpoints/calendario/caledarioApi';

interface Appointment {
    id: string;
    doctor: string;
    specialty: string;
    availableTime: string;
    booked?: boolean;
}

const AppointmentBooking = () => {
    const [specialties, setSpecialties] = useState<string[]>([]);
    const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);
    const [availableAppointments, setAvailableAppointments] = useState<Appointment[]>([]);
    const [bookedAppointments, setBookedAppointments] = useState<Appointment[]>([]);
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
    const [reprogramDialogVisible, setReprogramDialogVisible] = useState(false);
    const [newAppointmentTime, setNewAppointmentTime] = useState<Date | null>(null);
    const toast = useRef<Toast>(null);

    useEffect(() => {
        // Fetch specialties
        api.get('/api/specialization')
            .then((response) => setSpecialties(response.data.data))
            .catch((error) => console.error(error));
    }, []);

    useEffect(() => {
        if (selectedSpecialty) {
            // Fetch available appointments for the selected specialty
            CalendarioService.getListar()
                .then((data) => {
                    console.log(data);
                    setAvailableAppointments(data.data);
                    // setAvailableAppointments(data.filter((appointment: Appointment) => !appointment.booked));
                    setBookedAppointments(data.filter((appointment: Appointment) => appointment.booked));
                })
                .catch((error) => console.error(error));
        }
    }, [selectedSpecialty]);
    console.log(availableAppointments);

    const bookAppointment = () => {
        if (selectedAppointment) {
            createAppointment(selectedAppointment)
                .then((response) => {
                    toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Cita reservada con éxito', life: 3000 });
                    setBookedAppointments([...bookedAppointments, response.data]);
                    setAvailableAppointments(availableAppointments.filter((appointment) => appointment.id !== selectedAppointment.id));
                })
                .catch((error) => {
                    toast.current?.show({ severity: 'error', summary: 'Error', detail: 'No se pudo reservar la cita', life: 3000 });
                    console.error(error);
                });
        }
    };

    const cancelAppointment = (appointmentId: string) => {
        deleteAppointment(appointmentId)
            .then((response) => {
                toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Cita cancelada con éxito', life: 3000 });
                setBookedAppointments(bookedAppointments.filter((appointment) => appointment.id !== appointmentId));
            })
            .catch((error) => {
                toast.current?.show({ severity: 'error', summary: 'Error', detail: 'No se pudo cancelar la cita', life: 3000 });
                console.error(error);
            });
    };

    const reprogramAppointment = () => {
        if (selectedAppointment && newAppointmentTime) {
            const updatedAppointment = { ...selectedAppointment, availableTime: newAppointmentTime.toISOString() };
            updateAppointment(selectedAppointment.id, updatedAppointment)
                .then((response) => {
                    toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Cita reprogramada con éxito', life: 3000 });
                    setReprogramDialogVisible(false);
                    setBookedAppointments(bookedAppointments.map((appointment) => (appointment.id === selectedAppointment.id ? updatedAppointment : appointment)));
                })
                .catch((error) => {
                    toast.current?.show({ severity: 'error', summary: 'Error', detail: 'No se pudo reprogramar la cita', life: 3000 });
                    console.error(error);
                });
        }
    };

    return (
        <div>
            <Toast ref={toast} />
            <h2>Reservar Cita</h2>
            <Dropdown value={selectedSpecialty} options={specialties} onChange={(e) => setSelectedSpecialty(e.value)} placeholder="Selecciona una especialidad" optionLabel="name" />
            <h3>Horarios Disponibles</h3>
            <DataTable value={availableAppointments} selectionMode="single" onSelectionChange={(e) => setSelectedAppointment(e.value)}>
                <Column field="doctor_id" header="Doctor" />
                {/* <Column field="specialty" header="Especialidad" /> */}
                <Column field="time_start" header="Horario inicio" />
                <Column field="time_end" header="Horario final" />
            </DataTable>
            <Button label="Reservar Cita" onClick={bookAppointment} disabled={!selectedAppointment} />

            <h3>Citas Agendadas</h3>
            <DataTable value={bookedAppointments} selectionMode="single" onSelectionChange={(e) => setSelectedAppointment(e.value)}>
                <Column field="doctor" header="Doctor" />
                <Column field="specialty" header="Especialidad" />
                <Column field="availableTime" header="Horario" />
                <Column
                    body={(rowData: Appointment) => (
                        <div>
                            <Button label="Cancelar" onClick={() => cancelAppointment(rowData.id)} />
                            <Button
                                label="Reprogramar"
                                onClick={() => {
                                    setSelectedAppointment(rowData);
                                    setReprogramDialogVisible(true);
                                }}
                            />
                        </div>
                    )}
                    header="Acciones"
                />
            </DataTable>

            <Dialog header="Reprogramar Cita" visible={reprogramDialogVisible} onHide={() => setReprogramDialogVisible(false)}>
                <Calendar value={newAppointmentTime} onChange={(e) => setNewAppointmentTime(e.value || null)} showTime />
                <Button label="Reprogramar" onClick={reprogramAppointment} disabled={!newAppointmentTime} />
            </Dialog>
        </div>
    );
};

export default AppointmentBooking;
