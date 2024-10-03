'use client';
import React, { useEffect, useState } from 'react';

import { DataHorarios } from '@/types/demo';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toolbar } from 'primereact/toolbar';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { Controller } from 'react-hook-form';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { useTable } from '@/app/hooks/useCrudTable';
import { HorariosService } from '@/libs/endpoints/horarios/horariosApi';
import { DoctoresService } from '@/libs/endpoints/doctores/doctoresApi';

export default function PageHorarios() {
    const emptyHorario: DataHorarios = {
        id: null,
        doctor_id: null,
        day_of_week: null,
        time_start: '',
        time_end: ''
        // Los campos 'doctor' y 'day' son opcionales y no se envían al backend
    };

    const [doctors, setDoctors] = useState<{ id: number; first_name: string; last_name: string }[]>([]);
    const daysOfWeekOptions = [
        { label: 'Lunes', value: 2 },
        { label: 'Martes', value: 3 },
        { label: 'Miércoles', value: 4 },
        { label: 'Jueves', value: 5 },
        { label: 'Viernes', value: 6 },
        { label: 'Sábado', value: 7 },
        { label: 'Domingo', value: 8 }
    ];

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

    const {
        data: usuarios,
        loading,
        dialogVisible,
        deleteDialogVisible,
        record: horario,
        openNew,
        hideDialog,
        hideDeleteDialog,
        saveRecord,
        confirmDeleteRecord,
        deleteRecord,
        onPage,
        globalFilter,
        setGlobalFilter,
        first,
        rows,
        handleSubmit,
        control,
        errors,
        setValue,
        toast,
        setRecord,
        setDialogVisible
    } = useTable<DataHorarios>({
        service: {
            getAll: HorariosService.getListarHorarios,
            create: HorariosService.postCrear,
            update: HorariosService.putActualizar,
            delete: HorariosService.deleteEliminar
        },
        initialRecord: emptyHorario,
        keyField: 'id'
    });

    const onSubmit = (data: DataHorarios) => {
        // Transformar las horas a formato "HH:mm:ss"
        const timeStart = data.time_start instanceof Date ? data.time_start.toLocaleTimeString('es-ES', { hour12: false }) : data.time_start;
        const timeEnd = data.time_end instanceof Date ? data.time_end.toLocaleTimeString('es-ES', { hour12: false }) : data.time_end;

        // Crear un nuevo objeto excluyendo 'doctor' y 'day'
        const formData = {
            id: data.id,
            doctor_id: data.doctor_id,
            day_of_week: data.day_of_week,
            time_start: timeStart,
            time_end: timeEnd
        };

        saveRecord(formData);
    };

    const editRecord = (rowData: DataHorarios) => {
        try {
            // Convertir las horas a objetos Date, manejando posibles errores
            const timeStart = rowData.time_start ? new Date(`1970-01-01T${rowData.time_start}`) : null;
            const timeEnd = rowData.time_end ? new Date(`1970-01-01T${rowData.time_end}`) : null;

            // Verificar que las horas sean válidas
            if (!timeStart || isNaN(timeStart.getTime()) || !timeEnd || isNaN(timeEnd.getTime())) {
                console.error('Error: Las horas de inicio o fin no son válidas.');
                return;
            }

            // Preparar los datos para el formulario, excluyendo campos adicionales
            const formData = {
                id: rowData.id,
                doctor_id: rowData.doctor_id,
                day_of_week: rowData.day_of_week,
                time_start: timeStart,
                time_end: timeEnd
            };

            // Asignar los valores al formulario usando setValue
            setValue('id', formData.id);
            setValue('doctor_id', formData.doctor_id);
            setValue('day_of_week', formData.day_of_week);
            setValue('time_start', formData.time_start);
            setValue('time_end', formData.time_end);

            // Actualizar el estado del registro actual y mostrar el modal
            setRecord(formData);
            setDialogVisible(true);
        } catch (error) {
            console.error('Error en editRecord:', error);
        }
    };

    const dt = React.useRef<DataTable<any>>(null);

    const leftToolbarTemplate = () => (
        <div className="my-2">
            <Button label="Nuevo" icon="pi pi-plus" severity="success" className="mr-2" onClick={openNew} />
        </div>
    );

    const rightToolbarTemplate = () => <Button label="Exportar" icon="pi pi-upload" severity="help" onClick={() => dt.current?.exportCSV()} />;

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Gestión de Horarios</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" value={globalFilter} onChange={(e) => setGlobalFilter(e.target.value)} placeholder="Buscar..." />
            </span>
        </div>
    );

    const userDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Guardar" icon="pi pi-check" text onClick={handleSubmit(onSubmit)} />
        </>
    );

    const deleteUserDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteDialog} />
            <Button label="Sí" icon="pi pi-check" text onClick={deleteRecord} />
        </>
    );

    const codeBodyTemplate = (rowData: DataHorarios, { rowIndex }: { rowIndex: number }) => {
        return <>{first + rowIndex + 1}</>;
    };

    const actionBodyTemplate = (rowData: DataHorarios) => (
        <>
            <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editRecord(rowData)} />
            <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeleteRecord(rowData)} />
        </>
    );

    const timeStartBodyTemplate = (rowData: DataHorarios) => {
        return <>{rowData.time_start instanceof Date ? rowData.time_start.toLocaleTimeString('es-ES', { hour12: false }) : rowData.time_start}</>;
    };

    const timeEndBodyTemplate = (rowData: DataHorarios) => {
        return <>{rowData.time_end instanceof Date ? rowData.time_end.toLocaleTimeString('es-ES', { hour12: false }) : rowData.time_end}</>;
    };

    // Definir el arreglo con los nombres de los días de la semana
    const daysOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

    // Agregar los nombres de los doctores y días en los datos que mostramos en la tabla
    const horariosConDetalles = usuarios.map((horario) => {
        const doctor = doctors.find((doc) => doc.id === horario.doctor_id);
        const dayIndex = horario.day_of_week ? horario.day_of_week - 1 : -1;
        const dayName = daysOfWeek[dayIndex] || 'Día no válido';

        return {
            ...horario,
            doctor: doctor ? `${doctor.first_name} ${doctor.last_name}` : '',
            day: dayName
        };
    });

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" end={leftToolbarTemplate} start={rightToolbarTemplate}></Toolbar>
                    <DataTable ref={dt} value={horariosConDetalles} paginator rows={rows} totalRecords={usuarios.length} first={first} onPage={onPage} loading={loading} globalFilter={globalFilter} header={header}>
                        <Column field="id" header="No." body={codeBodyTemplate}></Column>
                        <Column field="doctor" header="Doctor" sortable></Column>
                        <Column field="day" header="Día" sortable></Column>
                        <Column field="time_start" header="Inicio" body={timeStartBodyTemplate} sortable></Column>
                        <Column field="time_end" header="Fin" body={timeEndBodyTemplate}></Column>
                        <Column body={actionBodyTemplate}></Column>
                    </DataTable>

                    <Dialog visible={dialogVisible} style={{ width: '450px' }} header="Horario" modal className="p-fluid" footer={userDialogFooter} onHide={hideDialog}>
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
                                <label htmlFor="day_of_week">Día</label>
                                <Controller
                                    name="day_of_week"
                                    control={control}
                                    rules={{ required: 'El día es obligatorio' }}
                                    render={({ field, fieldState }) => (
                                        <Dropdown id="day_of_week" value={field.value} onChange={(e) => field.onChange(e.value)} options={daysOfWeekOptions} placeholder="Seleccione un Día" className={fieldState.invalid ? 'p-invalid' : ''} />
                                    )}
                                />
                                {errors.day_of_week && <small className="p-error">{errors.day_of_week.message}</small>}
                            </div>
                            <div className="field">
                                <label htmlFor="time_start">Inicio</label>
                                <Controller
                                    name="time_start"
                                    control={control}
                                    rules={{ required: 'La hora de inicio es obligatoria' }}
                                    render={({ field, fieldState }) => (
                                        <Calendar
                                            id="time_start"
                                            value={field.value instanceof Date ? field.value : new Date()}
                                            onChange={(e) => field.onChange(e.value)}
                                            timeOnly
                                            hourFormat="24"
                                            placeholder="Seleccione la hora de inicio"
                                            className={fieldState.invalid ? 'p-invalid' : ''}
                                        />
                                    )}
                                />
                                {errors.time_start && <small className="p-error">{errors.time_start.message}</small>}
                            </div>
                            <div className="field">
                                <label htmlFor="time_end">Fin</label>
                                <Controller
                                    name="time_end"
                                    control={control}
                                    rules={{ required: 'La hora de fin es obligatoria' }}
                                    render={({ field, fieldState }) => (
                                        <Calendar
                                            id="time_end"
                                            value={field.value instanceof Date ? field.value : new Date()}
                                            onChange={(e) => field.onChange(e.value)}
                                            timeOnly
                                            hourFormat="24"
                                            placeholder="Seleccione la hora de fin"
                                            className={fieldState.invalid ? 'p-invalid' : ''}
                                        />
                                    )}
                                />
                                {errors.time_end && <small className="p-error">{errors.time_end.message}</small>}
                            </div>
                        </form>
                    </Dialog>

                    <Dialog visible={deleteDialogVisible} style={{ width: '450px' }} header="Confirmar" modal footer={deleteUserDialogFooter} onHide={hideDeleteDialog}>
                        <div className="confirmation-content">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {horario && (
                                <span>
                                    ¿Está seguro de eliminar el horario del doctor <b>{horario.doctor}</b> en el día <b>{horario.day_of_week !== null ? daysOfWeek[horario.day_of_week - 1] : 'Día no válido'}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
}
