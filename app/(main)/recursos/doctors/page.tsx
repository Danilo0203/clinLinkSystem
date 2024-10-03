'use client';
import React, { useEffect, useState } from 'react';

import { DetalleDoctor } from '@/types/demo';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toolbar } from 'primereact/toolbar';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { Controller } from 'react-hook-form';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { useTable } from '@/app/hooks/useCrudTable';
import { DoctoresDetalleService } from '@/libs/endpoints/doctores/doctoresDetalleApi';
import { DoctoresService } from '@/libs/endpoints/doctores/doctoresApi';

export default function PageDoctoresDetalle() {
    const emptyUser: DetalleDoctor = {
        id: null,
        doctor_id: null,
        license_number: null,
        years_of_experience: null,
        doctor: ''
    };
    const [doctors, setDoctors] = useState<{ id: number; first_name: string; last_name: string }[]>([]);

    const {
        data: doctores,
        loading,
        dialogVisible,
        deleteDialogVisible,
        record: doctor,
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
        toast,
        errors
    } = useTable<DetalleDoctor>({
        service: {
            getAll: DoctoresDetalleService.getListar,
            create: DoctoresDetalleService.postCrear,
            update: DoctoresDetalleService.putActualizar,
            delete: DoctoresDetalleService.deleteEliminar
        },
        initialRecord: emptyUser,
        keyField: 'id'
    });
    useEffect(() => {
        // Cargar lista de doctores
        const loadDoctors = async () => {
            try {
                const res = await DoctoresService.getListarDoctores();
                setDoctors(res.data);
            } catch (error) {
                console.error('Error al cargar los doctores:', error);
            }
        };

        loadDoctors();
    }, []);
    const dt = React.useRef<DataTable<any>>(null);

    const leftToolbarTemplate = () => (
        <div className="my-2">
            <Button label="Nuevo" icon="pi pi-plus" severity="success" className="mr-2" onClick={openNew} />
        </div>
    );

    const rightToolbarTemplate = () => <Button label="Exportar" icon="pi pi-upload" severity="help" onClick={() => dt.current?.exportCSV()} />;

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Tabla de Doctores Detalle</h5>
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

    const codeBodyTemplate = (rowData: DetalleDoctor, { rowIndex }: { rowIndex: number }) => {
        return <>{first + rowIndex + 1}</>;
    };

    const actionBodyTemplate = (rowData: DetalleDoctor) => (
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
                    <Toolbar className="mb-4" end={leftToolbarTemplate} start={rightToolbarTemplate}></Toolbar>
                    <DataTable ref={dt} value={doctores} paginator rows={rows} totalRecords={doctores.length} first={first} onPage={onPage} loading={loading} globalFilter={globalFilter} header={header}>
                        <Column field="id" header="No." body={codeBodyTemplate}></Column>
                        <Column field="doctor" header="Doctor" sortable></Column>
                        <Column field="license_number" header="Licencia" sortable></Column>
                        <Column field="years_of_experience" header="Años de Experiencia" sortable></Column>
                        <Column body={actionBodyTemplate}></Column>
                    </DataTable>

                    <Dialog visible={dialogVisible} style={{ width: '450px' }} header="Detalle Doctor" modal className="p-fluid" footer={userDialogFooter} onHide={hideDialog}>
                        <form>
                            <div className="field">
                                <label htmlFor="doctor_id">Doctor</label>
                                <Controller
                                    name="doctor_id"
                                    control={control}
                                    rules={{ required: 'El doctor es obligatorio' }}
                                    render={({ field, fieldState }) => (
                                        <Dropdown
                                            id="doctor_id"
                                            value={field.value}
                                            onChange={(e) => field.onChange(e.value)}
                                            options={doctors.map((doctor) => ({
                                                label: `${doctor.first_name} ${doctor.last_name}`,
                                                value: doctor.id
                                            }))}
                                            placeholder="Seleccione un Doctor"
                                            className={fieldState.invalid ? 'p-invalid' : ''}
                                        />
                                    )}
                                />
                                {errors.doctor_id && <small className="p-error">{errors.doctor_id.message}</small>}
                            </div>
                            <div className="field">
                                <label htmlFor="license_number">Licencia</label>
                                <InputText id="license_number" {...register('license_number', { required: true })} />
                            </div>
                            <div className="field">
                                <label htmlFor="years_of_experience">Años de experiencia</label>
                                <InputText id="years_of_experience" {...register('years_of_experience', { required: true })} />
                            </div>
                        </form>
                    </Dialog>

                    <Dialog visible={deleteDialogVisible} style={{ width: '450px' }} header="Confirmar" modal footer={deleteUserDialogFooter} onHide={hideDeleteDialog}>
                        <div className="confirmation-content">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {doctor && (
                                <span>
                                    ¿Está seguro de eliminar el doctor <b>{doctor.doctor}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
}
