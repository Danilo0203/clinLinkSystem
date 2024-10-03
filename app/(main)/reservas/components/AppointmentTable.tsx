import { useState, useRef } from 'react';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

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

interface AppointmentTableProps {
    appointments: Appointment[];
    setAppointments: (appointments: Appointment[]) => void;
}


export default function AppointmentTable({ appointments, setAppointments }: AppointmentTableProps) {
    const [selectedAppointments, setSelectedAppointments] = useState<Appointment[]>([]);
    const [appointment, setAppointment] = useState<Appointment | null>(null);
    const [deleteAppointmentDialog, setDeleteAppointmentDialog] = useState(false);
    const [editAppointmentDialog, setEditAppointmentDialog] = useState(false);
    const toast = useRef<Toast>(null);

    const editAppointment = (appointment: Appointment) => {
        setAppointment(appointment);
        setEditAppointmentDialog(true);
    };

    const saveAppointment = () => {
        const updatedAppointments = appointments.map((a) => (a.id === appointment?.id ? appointment : a));
        setAppointments(updatedAppointments);
        setEditAppointmentDialog(false);
        setAppointment(null);
        toast.current?.show({
            severity: 'success',
            summary: 'Successful',
            detail: 'Appointment Updated',
            life: 3000,
        });
    };

    const confirmDeleteAppointment = (appointment: Appointment) => {
        setAppointment(appointment);
        setDeleteAppointmentDialog(true);
    };

    const deleteAppointment = () => {
        const _appointments = appointments.filter((val) => val.id !== appointment?.id);
        setAppointments(_appointments);
        setDeleteAppointmentDialog(false);
        setAppointment(null);
        toast.current?.show({
            severity: 'success',
            summary: 'Successful',
            detail: 'Appointment Deleted',
            life: 3000,
        });
    };

    const deleteSelectedAppointments = () => {
        const _appointments = appointments.filter((val) => !selectedAppointments.includes(val));
        setAppointments(_appointments);
        setSelectedAppointments([]);
        toast.current?.show({
            severity: 'success',
            summary: 'Successful',
            detail: 'Appointments Deleted',
            life: 3000,
        });
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>, name: string) => {
        const val = (e.target && e.target.value) || '';
        let _appointment = { ...appointment, [name]: val } as Appointment;
        setAppointment(_appointment);
    };

    const actionBodyTemplate = (rowData: Appointment) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editAppointment(rowData)} />
                <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeleteAppointment(rowData)} />
            </>
        );
    };

    const deleteAppointmentDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={() => setDeleteAppointmentDialog(false)} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteAppointment} />
        </>
    );

    const editAppointmentDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={() => setEditAppointmentDialog(false)} />
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveAppointment} />
        </>
    );

    return (
        <>
            <Toast ref={toast} />
            <Dialog visible={deleteAppointmentDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteAppointmentDialogFooter} onHide={() => setDeleteAppointmentDialog(false)}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {appointment && <span>Are you sure you want to delete the appointment for Doctor ID: <b>{appointment.doctor_id}</b>?</span>}
                </div>
            </Dialog>
            <Dialog visible={editAppointmentDialog} style={{ width: '450px' }} header="Edit Appointment" modal className="p-fluid" footer={editAppointmentDialogFooter} onHide={() => setEditAppointmentDialog(false)}>
                {appointment && (
                    <>
                        <div className="field">
                            <label htmlFor="room_id">Sala</label>
                            <InputNumber id="room_id" value={appointment.room_id} onValueChange={(e) => onInputChange(e as any, 'room_id')} required autoFocus />
                        </div>
                        <div className="field">
                            <label htmlFor="appointment_status_id">Estado</label>
                            <InputNumber id="appointment_status_id" value={appointment.appointment_status_id} onValueChange={(e) => onInputChange(e as any, 'appointment_status_id')} required />
                        </div>
                        <div className="field">
                            <label htmlFor="patient_id">Paciente</label>
                            <InputNumber id="patient_id" value={appointment.patient_id} onValueChange={(e) => onInputChange(e as any, 'patient_id')} required />
                        </div>
                        <div className="field">
                            <label htmlFor="doctor_id">Doctor </label>
                            <InputNumber id="doctor_id" value={appointment.doctor_id} onValueChange={(e) => onInputChange(e as any, 'doctor_id')} required />
                        </div>
                        <div className="field">
                            <label htmlFor="appointment_date">Fecha</label>
                            <InputText type='date' id="appointment_date" value={appointment.appointment_date} onChange={(e) => onInputChange(e, 'appointment_date')} required />
                        </div>
                        <div className="field">
                            <label htmlFor="start_timestamp">Hora de Inicio</label>
                            <InputText type='time' id="start_timestamp" value={appointment.start_timestamp} onChange={(e) => onInputChange(e, 'start_timestamp')} required />
                        </div>
                        <div className="field">
                            <label htmlFor="end_timestamp">Hora Final</label>
                            <InputText type='time' id="end_timestamp" value={appointment.end_timestamp} onChange={(e) => onInputChange(e, 'end_timestamp')} required />
                        </div>
                    </>
                )}
            </Dialog>
            {/*       <Button label="Delete Selected" icon="pi pi-times" className="p-button-danger" onClick={deleteSelectedAppointments} disabled={!selectedAppointments.length} />
 */}      <DataTable
                value={appointments}
                selection={selectedAppointments}
                onSelectionChange={(e) => setSelectedAppointments(e.value)}
                dataKey="id"
                paginator
                rows={10}
                rowsPerPageOptions={[5, 10, 25]}
                className="datatable-responsive"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} appointments"
                globalFilter={null}
                emptyMessage="No se encontró ningún registro"
                header="Gestión de Citas"
                selectionMode="multiple"
            >
                <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                <Column field="id" header="ID" sortable></Column>
                <Column field="room_id" header="Sala" sortable></Column>
                <Column field="appointment_status_id" header="Estado de Cita" sortable headerStyle={{ minWidth: '10rem'}}></Column>
                <Column field="patient_id" header="Paciente" sortable></Column>
                <Column field="doctor_id" header="Doctor" sortable></Column>
                <Column field="appointment_date" header="Cita" sortable headerStyle={{ minWidth: '10rem', }}></Column>
                <Column field="start_timestamp" header="Horario de Inicio" sortable headerStyle={{ minWidth: '10rem', }}></Column>
                <Column field="end_timestamp" header="Horario Final" sortable headerStyle={{ minWidth: '10rem', }}></Column>
                <Column body={actionBodyTemplate} headerStyle={{ minWidth: '12rem' }}></Column>
            </DataTable>
        </>
    );
}
