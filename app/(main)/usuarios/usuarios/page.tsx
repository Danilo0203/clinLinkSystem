'use client';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import React, { useEffect, useRef, useState } from 'react';
import { UsuariosService } from '@/libs/endpoints/usuarios/usuariosApi';
import { Dropdown } from 'primereact/dropdown';
import { Controller, useForm } from 'react-hook-form';
import { AxiosError } from 'axios';
import { Datum, UsuarioProp } from '@/types/demo';

export default function PageUsuarios() {
    let emptyProduct = {
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

    const [usuarios, setUsuarios] = useState([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [loading, setLoading] = useState(false);
    const [userDialog, setUserDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [usuario, setUsuario] = useState(emptyProduct);
    const [globalFilter, setGlobalFilter] = useState('');
    const { register, handleSubmit, setValue, control, reset } = useForm<UsuarioProp>();
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);

    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(10);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        setLoading(true);
        try {
            const data = await UsuariosService.getListarUsuarios();
            setUsuarios(data.data);
            setTotalRecords(data.data.length);
        } catch (error) {
            console.error('Error al cargar los usuarios:', error);
        } finally {
            setLoading(false);
        }
    };

    const onPage = (event: { first: React.SetStateAction<number>; rows: React.SetStateAction<number> }) => {
        setFirst(event.first);
        setRows(event.rows);
    };

    const openNew = () => {
        setUsuario(emptyProduct);
        reset(emptyProduct);
        setUserDialog(true);
    };

    const hideDialog = () => {
        setUserDialog(false);
    };

    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    };

    const saveProduct = async (data: UsuarioProp) => {
        if (usuario.id) {
            try {
                await UsuariosService.putActualizar(usuario.id, data);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Usuario Actualizado',
                    detail: 'El usuario ha sido actualizado',
                    life: 3000
                });
            } catch (error) {
                if (error instanceof AxiosError) {
                    console.log(error.response);
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Error',
                        detail: `Error al actualizar el usuario: ${error.response?.data.message}`,
                        life: 3000
                    });
                }
            }
        } else {
            try {
                await UsuariosService.postCrear(data);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Usuario Creado',
                    detail: 'El usuario ha sido creado exitosamente',
                    life: 3000
                });
            } catch (error) {
                if (error instanceof AxiosError) {
                    console.log(error.response);
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Error',
                        detail: `Error al crear el usuario: ${error.response?.data.message}`,
                        life: 3000
                    });
                }
            }
        }

        await loadUsers();
        setUserDialog(false);
    };

    const editProduct = (usuario: UsuarioProp) => {
        setUsuario(usuario);
        (Object.keys(usuario) as (keyof UsuarioProp)[]).forEach((field) => setValue(field, usuario[field]));
        setUserDialog(true);
    };

    const confirmDeleteProduct = (usuario: UsuarioProp) => {
        setUsuario(usuario);
        setDeleteProductDialog(true);
    };

    const deleteProduct = async () => {
        try {
            await UsuariosService.deleteEliminar(usuario.id);
            await loadUsers();
            setDeleteProductDialog(false);
            setUsuario(emptyProduct);
            toast.current?.show({
                severity: 'success',
                summary: 'Usuario Eliminado',
                detail: 'El usuario ha sido eliminado correctamente',
                life: 3000
            });
        } catch (error) {
            if (error instanceof AxiosError) {
                console.log(error.response);
                toast.current?.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: `Error al eliminar el usuario: ${error.response?.data.message}`,
                    life: 3000
                });
            }
        }
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
        return <Button label="Exportar" icon="pi pi-upload" severity="help" onClick={exportCSV} />;
    };

    const codeBodyTemplate = (rowdata: any, { rowIndex }: { rowIndex: number }) => {
        return (
            <>
                <span className="p-column-title">No.</span>
                {rowIndex + 1}
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
                <span className="p-column-title">Número Teléfono</span>
                {rowData.phone_number}
            </>
        );
    };

    const actionBodyTemplate = (rowData: UsuarioProp) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editProduct(rowData)} />
                <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeleteProduct(rowData)} />
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Tabla de Usuarios</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" value={globalFilter} onChange={(e) => setGlobalFilter(e.target.value)} placeholder="Buscar..." />
            </span>
        </div>
    );

    const productDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Guardar" icon="pi pi-check" text onClick={handleSubmit(saveProduct)} />
        </>
    );

    const deleteProductDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteProductDialog} />
            <Button label="Sí" icon="pi pi-check" text onClick={deleteProduct} />
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
                        value={usuarios}
                        paginator
                        rows={rows}
                        totalRecords={totalRecords}
                        first={first}
                        onPage={onPage}
                        loading={loading}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} usuarios"
                        globalFilter={globalFilter}
                        globalFilterFields={['first_name', 'last_name', 'email', 'role.name']}
                        emptyMessage="No se encontraron registros"
                        header={header}
                    >
                        <Column field="id" header="No." body={codeBodyTemplate} headerStyle={{ minWidth: '4rem' }}></Column>
                        <Column field="first_name" header="Nombre" sortable body={nameBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="last_name" header="Apellidos" sortable body={lastNameBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="role.name" header="Rol" sortable body={rolBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="email" header="Correo" sortable body={emailBodyTemplate} headerStyle={{ minWidth: '20rem' }}></Column>
                        <Column field="phone_number" header="Número Teléfono" body={phoneNumberBodyTemplate} sortable headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={userDialog} style={{ width: '450px' }} header="Usuario" modal className="p-fluid" onHide={hideDialog} footer={productDialogFooter}>
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
                                <InputText id="password" {...register('password')} type="password" />
                            </div>

                            <div className="field">
                                <label htmlFor="password_confirmation">Confirmar Contraseña</label>
                                <InputText id="password_confirmation" {...register('password_confirmation')} type="password" />
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
                                            className={fieldState.invalid ? 'p-invalid' : ''}
                                        />
                                    )}
                                />
                            </div>
                        </form>
                    </Dialog>

                    <Dialog visible={deleteProductDialog} style={{ width: '450px' }} header="Confirmar" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
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
