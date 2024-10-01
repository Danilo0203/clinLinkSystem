'use client';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import React, { useRef, useState } from 'react';
import { UsuariosService } from '@/libs/endpoints/usuarios/usuariosApi';
import { Dropdown } from 'primereact/dropdown';
import { Controller, useForm } from 'react-hook-form';
import { Datum, UsuarioProp } from '@/types/demo';
import { useCrud } from '@/app/hooks/useCrudTable';

export default function PageUsuarios() {
    let emptyUser = {
        id: null,
        first_name: '',
        last_name: '',
        phone_number: '',
        email: '',
        role_id: null,
        username: '',
        password: '',
        password_confirmation: '',
        date_of_birth: ''
    };

    const { register, control, handleSubmit, setValue, reset } = useForm();

    const dt = useRef<DataTable<any>>(null);

    // const [globalFilter, setGlobalFilter] = useState('');

    const {
        record: usuario,
        data,
        isLoading,
        dialogVisible,
        deleteDialogVisible,
        openNew,
        confirmDeleteRecord,
        saveRecord,
        deleteRecord,
        hideDeleteDialog,
        lazyState,
        setLazyState,
        setRecord,
        setDialogVisible,
        toast
    } = useCrud({
        service: UsuariosService,
        emptyRecord: emptyUser,
        queryKey: 'usuarios'
    });

    const onPage = (event: { first: number; rows: number; page?: number }) => {
        setLazyState((prevState) => ({
            ...prevState,
            first: event.first,
            rows: event.rows,
            page: (event.page ?? 0) + 1
        }));
    };

    // Editar un registro
    const editRecord = (record: any) => {
        setRecord(record);
        Object.keys(record).forEach((field) => {
            setValue(field, record[field]);
        });

        setDialogVisible(true);
    };

    // Cerrar los diálogos
    const hideDialog = () => {
        reset(emptyUser);
        setDialogVisible(false);
    };

    // const onSort = (event: { sortField: any; sortOrder: any }) => {
    //     setLazyState((prevState) => ({
    //         ...prevState,
    //         sortField: event.sortField,
    //         sortOrder: event.sortOrder
    //     }));
    // };

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
        return <Button label="Exportar" icon="pi pi-upload" severity="help" onClick={exportCSV} />;
    };

    const codeBodyTemplate = (rowData: UsuarioProp, { rowIndex }: { rowIndex: number }) => {
        return (
            <>
                <span className="p-column-title">No.</span>
                {rowIndex + 1} {/* Correlativo basado en el índice de fila más la posición de la paginación */}
            </>
        );
    };

    const nameBodyTemplate = (rowData: UsuarioProp) => {
        return (
            <>
                <span className="p-column-title">Nombres</span>
                {rowData.first_name}
            </>
        );
    };

    const lastNameBodyTemplate = (rowData: UsuarioProp) => {
        return (
            <>
                <span className="p-column-title">Apellidos</span>
                {rowData.last_name}
            </>
        );
    };

    const rolBodyTemplate = (rowData: Datum) => {
        return (
            <>
                <span className="p-column-title">Rol</span>
                {rowData.role?.name}
            </>
        );
    };

    const emailBodyTemplate = (rowData: UsuarioProp) => {
        return (
            <>
                <span className="p-column-title">Correo</span>
                {rowData.email}
            </>
        );
    };

    const phoneNumberBodyTemplate = (rowData: UsuarioProp) => {
        return (
            <>
                <span className="p-column-title">Numero Telefono</span>
                {rowData.phone_number}
            </>
        );
    };

    const actionBodyTemplate = (rowData: UsuarioProp) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editRecord(rowData)} />
                <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeleteRecord(rowData)} />
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Tabla de Roles</h5>
        </div>
    );

    const productDialogFooter = (
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

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" end={leftToolbarTemplate} start={rightToolbarTemplate}></Toolbar>

                    <DataTable
                        ref={dt}
                        value={data?.data.data}
                        lazy
                        filterDisplay="row"
                        paginator
                        rows={lazyState.rows}
                        totalRecords={data?.data.total || 0}
                        first={lazyState.first}
                        onPage={onPage}
                        // globalFilter={globalFilter}
                        // onSort={onSort}
                        // onFilter={onFilter}
                        loading={isLoading}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} usuarios"
                        emptyMessage="No se encontraron registros"
                        header={header}
                    >
                        <Column field="id" header="Id" body={codeBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="first_name" header="Nombre" body={nameBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="last_name" header="Apellidos" body={lastNameBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="rol" header="Rol" body={rolBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="email" header="Correo" body={emailBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="phone_number" header="Numero Telefono" body={phoneNumberBodyTemplate}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={dialogVisible} style={{ width: '450px' }} header="Usuario" modal className="p-fluid" onHide={hideDialog} footer={productDialogFooter}>
                        <form>
                            <div className="field">
                                <label htmlFor="first_name">Nombre</label>
                                <InputText id="first_name" {...register('first_name', { required: true })} autoFocus />
                            </div>

                            <div className="field">
                                <label htmlFor="last_name">Apellido</label>
                                <InputText id="last_name" {...register('last_name', { required: true })} />
                            </div>

                            <div className="field">
                                <label htmlFor="username">Usuario</label>
                                <InputText id="username" {...register('username', { required: true })} />
                            </div>

                            <div className="field">
                                <label htmlFor="email">Correo</label>
                                <InputText id="email" {...register('email', { required: true })} />
                            </div>

                            <div className="field">
                                <label htmlFor="phone_number">Teléfono</label>
                                <InputText id="phone_number" {...register('phone_number', { required: true })} />
                            </div>

                            <div className="field">
                                <label htmlFor="password">Contraseña</label>
                                <InputText id="password" {...register('password', { required: true })} type="password" />
                            </div>

                            <div className="field">
                                <label htmlFor="password_confirmation">Confirmar Contraseña</label>
                                <InputText id="password_confirmation" {...register('password_confirmation', { required: true })} type="password" />
                            </div>

                            <div className="field">
                                <label htmlFor="date_of_birth">Fecha de Nacimiento</label>
                                <InputText id="date_of_birth" {...register('date_of_birth', { required: true })} placeholder="YYYY-MM-DD" />
                            </div>

                            <div className="field">
                                <label htmlFor="role_id">Rol</label>
                                <Controller
                                    name="role_id"
                                    control={control}
                                    rules={{ required: 'El rol es obligatorio' }}
                                    render={({ field, fieldState }) => (
                                        <Dropdown
                                            id="role_id"
                                            value={field.value}
                                            onChange={(e) => {
                                                field.onChange(e.value);
                                            }}
                                            options={[
                                                { label: 'Administrador', value: 1 },
                                                { label: 'Medico', value: 2 },
                                                { label: 'Cliente', value: 3 }
                                            ]}
                                            placeholder="Seleccione un Rol"
                                            checkmark={true}
                                            className={fieldState.invalid ? 'p-invalid' : ''}
                                        />
                                    )}
                                />
                            </div>
                        </form>
                    </Dialog>

                    <Dialog visible={deleteDialogVisible} style={{ width: '450px' }} header="Confirmar" modal footer={deleteUserDialogFooter} onHide={hideDeleteDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {usuario && (
                                <span>
                                    ¿Está seguro de eliminar el usuario{' '}
                                    <b>
                                        {usuario.first_name} {usuario.last_name}
                                    </b>
                                    ?
                                </span>
                            )}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
}
