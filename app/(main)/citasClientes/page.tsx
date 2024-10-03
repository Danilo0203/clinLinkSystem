'use client';
import React from 'react';

import { DataReserva } from '@/types/demo';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toolbar } from 'primereact/toolbar';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';

import { useTable } from '@/app/hooks/useCrudTable';
import { ReservasService } from '@/libs/endpoints/reservas/reservasApi';

export default function PageReservas() {
    const emptyReserva: DataReserva = {
        id: '',
        room_id: '',
        appointment_status_id: '',
        patient_id: '',
        doctor_id: '',
        start_timestamp: null,
        end_timestamp: null
    };

    const {
        data: reservas,
        loading,
        dialogVisible,
        deleteDialogVisible,
        record: reserva,
        openNew,
        hideDialog,
        hideDeleteDialog,
        saveRecord,
        editRecord,
        confirmDeleteRecord,
        deleteRecord,
        onPage,
        globalFilter,
        setGlobalFilter,
        first,
        rows,
        register,
        handleSubmit,
        control,
        toast
    } = useTable<DataReserva>({
        service: {
            getAll: ReservasService.getListar,
            create: ReservasService.postCrear,
            update: ReservasService.putActualizar,
            delete: ReservasService.deleteEliminar
        },
        initialRecord: emptyReserva,
        keyField: 'id'
    });

    const dt = React.useRef<DataTable<any>>(null);

    // const leftToolbarTemplate = () => (
    //     <div className="my-2">
    //         <Button label="Nuevo" icon="pi pi-plus" severity="success" className="mr-2" onClick={openNew} />
    //     </div>
    // );

    const rightToolbarTemplate = () => <Button label="Exportar" icon="pi pi-upload" severity="help" onClick={() => dt.current?.exportCSV()} />;

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Tabla de Reservas</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" value={globalFilter} onChange={(e) => setGlobalFilter(e.target.value)} placeholder="Buscar..." />
            </span>
        </div>
    );

    const userDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Guardar" icon="pi pi-check" text onClick={handleSubmit(saveRecord)} />
        </>
    );

    const deleteUserDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteDialog} />
            <Button label="Sí" icon="pi pi-check" text onClick={deleteRecord} />
        </>
    );

    const codeBodyTemplate = (rowData: DataReserva, { rowIndex }: { rowIndex: number }) => {
        return <>{first + rowIndex + 1}</>;
    };

    const actionBodyTemplate = (rowData: DataReserva) => (
        <>
            <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editRecord(rowData)} />
            <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeleteRecord(rowData)} />
        </>
    );

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" start={rightToolbarTemplate}></Toolbar>
                    <DataTable ref={dt} value={reservas} paginator rows={rows} totalRecords={reservas.length} first={first} onPage={onPage} loading={loading} globalFilter={globalFilter} header={header}>
                        <Column field="id" header="No." body={codeBodyTemplate}></Column>
                        <Column field="room_id" header="Cuarto" sortable></Column>
                        <Column field="doctor_id" header="Doctor" sortable></Column>
                        <Column field="patient_id" header="Paciente"></Column>
                        <Column field="start_timestamp" header="Inicio"></Column>
                        <Column field="end_timestamp" header="Final"></Column>
                        <Column field="appointment_status_id" header="Estado Cita" sortable></Column>
                        <Column body={actionBodyTemplate}></Column>
                    </DataTable>

                    <Dialog visible={dialogVisible} style={{ width: '450px' }} header="Usuario" modal className="p-fluid" footer={userDialogFooter} onHide={hideDialog}>
                        <form>
                            <div className="field">
                                <label htmlFor="room_id">Cuarto</label>
                                <InputText id="room_id" {...register('room_id', { required: true })} autoFocus />
                            </div>
                            <div className="field">
                                <label htmlFor="doctor_id">Doctor</label>
                                <InputText id="doctor_id" {...register('doctor_id', { required: true })} />
                            </div>
                            <div className="field">
                                <label htmlFor="patient_id">Paciente</label>
                                <InputText id="patient_id" {...register('patient_id', { required: true })} />
                            </div>
                            <div className="field">
                                <label htmlFor="start_timestamp">Incio</label>
                                <InputText id="start_timestamp" {...register('start_timestamp')} />
                            </div>
                            <div className="field">
                                <label htmlFor="end_timestamp">Final</label>
                                <InputText id="end_timestamp" {...register('end_timestamp')} />
                            </div>
                            <div className="field">
                                <label htmlFor="appointment_status_id">Estado</label>
                                <InputText id="appointment_status_id" {...register('appointment_status_id')} />
                            </div>
                        </form>
                    </Dialog>

                    <Dialog visible={deleteDialogVisible} style={{ width: '450px' }} header="Confirmar" modal footer={deleteUserDialogFooter} onHide={hideDeleteDialog}>
                        <div className="confirmation-content">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {reserva && (
                                <span>
                                    ¿Está seguro de cancelar la cita del paciente <b>{reserva.patient_id}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
}
