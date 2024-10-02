'use client';
import React from 'react';

import { UsuariosService } from '@/libs/endpoints/usuarios/usuariosApi';
import { UsuarioProp } from '@/types/demo';
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

export default function PageUsuarios() {
    const emptyUser: UsuarioProp = {
        id: null,
        first_name: '',
        last_name: '',
        phone_number: '',
        email: '',
        role_id: null,
        username: '',
        password: '',
        password_confirmation: '',
        date_of_birth: '',
        role: {
            id: 0,
            name: ''
        }
    };

    const {
        data: usuarios,
        loading,
        dialogVisible,
        deleteDialogVisible,
        record: usuario,
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
    } = useTable<UsuarioProp>({
        service: {
            getAll: UsuariosService.getListarUsuarios,
            create: UsuariosService.postCrear,
            update: UsuariosService.putActualizar,
            delete: UsuariosService.deleteEliminar
        },
        initialRecord: emptyUser,
        keyField: 'id'
    });

    const dt = React.useRef<DataTable<any>>(null);

    const leftToolbarTemplate = () => (
        <div className="my-2">
            <Button label="Nuevo" icon="pi pi-plus" severity="success" className="mr-2" onClick={openNew} />
        </div>
    );

    const rightToolbarTemplate = () => <Button label="Exportar" icon="pi pi-upload" severity="help" onClick={() => dt.current?.exportCSV()} />;

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Tabla de Usuarios</h5>
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

    const codeBodyTemplate = (rowData: UsuarioProp, { rowIndex }: { rowIndex: number }) => {
        return <>{first + rowIndex + 1}</>;
    };

    const actionBodyTemplate = (rowData: UsuarioProp) => (
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
                    <DataTable ref={dt} value={usuarios} paginator rows={rows} totalRecords={usuarios.length} first={first} onPage={onPage} loading={loading} globalFilter={globalFilter} header={header}>
                        <Column field="id" header="No." body={codeBodyTemplate}></Column>
                        <Column field="first_name" header="Nombre" sortable></Column>
                        <Column field="last_name" header="Apellido" sortable></Column>
                        <Column field="email" header="Correo" sortable></Column>
                        <Column field="phone_number" header="Teléfono"></Column>
                        <Column field="role.name" header="Rol" sortable></Column>
                        <Column body={actionBodyTemplate}></Column>
                    </DataTable>

                    <Dialog visible={dialogVisible} style={{ width: '450px' }} header="Usuario" modal className="p-fluid" footer={userDialogFooter} onHide={hideDialog}>
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
                                <label htmlFor="email">Correo</label>
                                <InputText id="email" {...register('email', { required: true })} />
                            </div>
                            <div className="field">
                                <label htmlFor="phone_number">Teléfono</label>
                                <InputText id="phone_number" {...register('phone_number')} />
                            </div>
                            <div className="field">
                                <label htmlFor="username">Usuario</label>
                                <InputText id="username" {...register('username')} />
                            </div>
                            <div className="field">
                                <label htmlFor="password">Contraseña</label>
                                <InputText id="password" {...register('password')} type="password" />
                            </div>
                            <div className="field">
                                <label htmlFor="date_of_birth">Fecha de Nacimiento</label>
                                <InputText id="date_of_birth" {...register('date_of_birth')} placeholder="YYYY-MM-DD" />
                            </div>
                            <div className="field">
                                <label htmlFor="role_id">Rol</label>
                                <Controller
                                    name="role_id"
                                    control={control}
                                    render={({ field }) => (
                                        <Dropdown
                                            id="role_id"
                                            value={field.value}
                                            onChange={(e) => field.onChange(e.value)}
                                            options={[
                                                { label: 'Administrador', value: 1 },
                                                { label: 'Médico', value: 2 },
                                                { label: 'Cliente', value: 3 }
                                            ]}
                                            placeholder="Seleccione un Rol"
                                        />
                                    )}
                                />
                            </div>
                        </form>
                    </Dialog>

                    <Dialog visible={deleteDialogVisible} style={{ width: '450px' }} header="Confirmar" modal footer={deleteUserDialogFooter} onHide={hideDeleteDialog}>
                        <div className="confirmation-content">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {usuario && (
                                <span>
                                    ¿Está seguro de eliminar el usuario <b>{usuario.first_name + ' ' + usuario.last_name}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
}
