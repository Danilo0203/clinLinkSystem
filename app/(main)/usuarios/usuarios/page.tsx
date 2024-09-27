'use client';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { InputNumber, InputNumberValueChangeEvent } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { RadioButton, RadioButtonChangeEvent } from 'primereact/radiobutton';
import { Rating } from 'primereact/rating';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';
import { ProductService } from '../../../../demo/service/ProductService';
import { Demo } from '@/types';
import { RolesService } from '@/libs/endpoints/usuarios/rolesApi';
import { Dropdown } from 'primereact/dropdown';
import { useForm } from 'react-hook-form';

export default function PageUsuarios() {
    let emptyProduct = {
        first_name: '',
        last_name: '',
        phone_number: '',
        email: '',
        role: ''
    };

    const [usuarios, setUsuarios] = useState(null);
    const [productDialog, setProductDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [usuario, setUsuario] = useState(emptyProduct);
    const [selectedProducts, setSelectedProducts] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const { register, handleSubmit } = useForm();
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);

    useEffect(() => {
        RolesService.getListarRoles().then((data) => setUsuarios(data.data as any));
        // ProductService.getProducts().then((data) => setUsuarios(data as any));
    }, []);

    const openNew = () => {
        setUsuario(emptyProduct);
        setSubmitted(false);
        setProductDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setProductDialog(false);
    };

    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    };

    const hideDeleteProductsDialog = () => {
        setDeleteProductsDialog(false);
    };

    const saveProduct = (data) => {
        console.log(data);
        setSubmitted(true);

        // if (usuario.first_name.trim()) {
        //     let _usuarios = [...(usuarios as any)];
        //     let _product = { ...usuario };
        //     if (usuario.id) {
        //         const index = findIndexById(usuario.id);

        //         _usuarios[index] = _product;
        //         toast.current?.show({
        //             severity: 'success',
        //             summary: 'Successful',
        //             detail: 'Product Updated',
        //             life: 3000
        //         });
        //     } else {
        //         _product.id = createId();
        //         _product.image = 'usuario-placeholder.svg';
        //         _usuarios.push(_product);
        //         toast.current?.show({
        //             severity: 'success',
        //             summary: 'Successful',
        //             detail: 'Product Created',
        //             life: 3000
        //         });
        //     }

        // }
        // setUsuarios(_usuarios as any);
        // setProductDialog(false);
        // setUsuario(emptyProduct);
    };

    const editProduct = (usuario: Demo.Product) => {
        setUsuario({ ...usuario });
        setProductDialog(true);
    };

    const confirmDeleteProduct = (usuario: Demo.Product) => {
        setUsuario(usuario);
        setDeleteProductDialog(true);
    };

    const deleteProduct = () => {
        let _usuarios = (usuarios as any)?.filter((val: any) => val.id !== usuario.id);
        setUsuarios(_usuarios);
        setDeleteProductDialog(false);
        setUsuario(emptyProduct);
        toast.current?.show({
            severity: 'success',
            summary: 'Successful',
            detail: 'Product Deleted',
            life: 3000
        });
    };

    const findIndexById = (id: string) => {
        let index = -1;
        for (let i = 0; i < (usuarios as any)?.length; i++) {
            if ((usuarios as any)[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    };

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

    const confirmDeleteSelected = () => {
        setDeleteProductsDialog(true);
    };

    const deleteSelectedProducts = () => {
        let _usuarios = (usuarios as any)?.filter((val: any) => !(selectedProducts as any)?.includes(val));
        setUsuarios(_usuarios);
        setDeleteProductsDialog(false);
        setSelectedProducts(null);
        toast.current?.show({
            severity: 'success',
            summary: 'Successful',
            detail: 'Products Deleted',
            life: 3000
        });
    };

    const onCategoryChange = (e: RadioButtonChangeEvent) => {
        let _product = { ...usuario };
        _product['category'] = e.value;
        setUsuario(_product);
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: string) => {
        const val = (e.target && e.target.value) || '';
        let _product = { ...usuario };
        _product[`${name}`] = val;

        setUsuario(_product);
    };

    const onInputNumberChange = (e: InputNumberValueChangeEvent, name: string) => {
        const val = e.value || 0;
        let _product = { ...usuario };
        _product[`${name}`] = val;

        setUsuario(_product);
    };

    const leftToolbarTemplate = () => {
        return (
            <div className="my-2">
                <Button label="Nuevo" icon="pi pi-plus" severity="success" className=" mr-2" onClick={openNew} />
                <Button label="Eliminar" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedProducts || !(selectedProducts as any).length} />
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

    const codeBodyTemplate = (rowData: Demo.Product) => {
        return (
            <>
                <span className="p-column-title">No.</span>
                {rowData.id}
            </>
        );
    };

    const nameBodyTemplate = (rowData: Demo.Product) => {
        return (
            <>
                <span className="p-column-title">Nombres</span>
                {rowData.first_name}
            </>
        );
    };

    const lastNameBodyTemplate = (rowData: Demo.Product) => {
        return (
            <>
                <span className="p-column-title">Apellidos</span>
                {rowData.last_name}
            </>
        );
    };

    const rolBodyTemplate = (rowData: Demo.Product) => {
        return (
            <>
                <span className="p-column-title">Rol</span>
                {rowData.role.name}
            </>
        );
    };

    const emailBodyTemplate = (rowData: Demo.Product) => {
        return (
            <>
                <span className="p-column-title">Rol</span>
                {rowData.email}
            </>
        );
    };

    const phoneNumberBodyTemplate = (rowData: Demo.Product) => {
        return (
            <>
                <span className="p-column-title">Numero Telefono</span>
                {rowData.phone_number}
            </>
        );
    };

    // const statusBodyTemplate = (rowData: Demo.Product) => {
    //     return (
    //         <>
    //             <span className="p-column-title">Status</span>
    //             <span className={`usuario-badge status-${rowData.inventoryStatus?.toLowerCase()}`}>{rowData.inventoryStatus}</span>
    //         </>
    //     );
    // };

    const actionBodyTemplate = (rowData: Demo.Product) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editProduct(rowData)} />
                <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeleteProduct(rowData)} />
            </>
        );
    };

    // Arreglar el error de busqueda de tabla
    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Tabla de Roles</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder="Buscar..." />
            </span>
        </div>
    );

    const productDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Guardar" icon="pi pi-check" text onClick={saveProduct} />
        </>
    );

    const deleteProductDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteProductDialog} />
            <Button label="Sí" icon="pi pi-check" text onClick={deleteProduct} />
        </>
    );

    const deleteProductsDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteProductsDialog} />
            <Button label="Sí" icon="pi pi-check" text onClick={deleteSelectedProducts} />
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
                        selection={selectedProducts}
                        onSelectionChange={(e) => setSelectedProducts(e.value)}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} usuarios"
                        globalFilter={globalFilter}
                        emptyMessage="No se encontro ningun registro"
                        header={header}
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                        <Column field="id" header="Id" sortable body={codeBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="first_name" header="Nombre" sortable body={nameBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="last_name" header="Apellidos" sortable body={lastNameBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="rol" header="Rol" sortable body={rolBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="email" header="Correo" sortable body={emailBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="phone_number" header="Numero Telefono" body={phoneNumberBodyTemplate} sortable></Column>
                        {/* <Column field="inventoryStatus" header="Status" body={statusBodyTemplate} sortable headerStyle={{ minWidth: '10rem' }}></Column> */}
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={productDialog} style={{ width: '450px' }} header="Usuario" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                        <form action="PUT">
                            <div className="field">
                                <label htmlFor="first_name">Nombre</label>
                                <InputText
                                    id="first_name"
                                    value={usuario.first_name}
                                    // onChange={(e) => onInputChange(e, 'first_name')}
                                    required
                                    autoFocus
                                    className={classNames({
                                        'p-invalid': submitted && !usuario.first_name
                                    })}
                                    {...register('first_name')}
                                />
                                {submitted && !usuario.first_name && <small className="p-invalid">Este campo es requerido</small>}
                            </div>

                            <div className="field">
                                <label htmlFor="last_name">Apellido</label>
                                <InputText
                                    id="last_name"
                                    value={usuario.last_name}
                                    onChange={(e) => onInputChange(e, 'last_name')}
                                    required
                                    autoFocus
                                    className={classNames({
                                        'p-invalid': submitted && !usuario.last_name
                                    })}
                                />
                                {submitted && !usuario.last_name && <small className="p-invalid">Este campo es requerido</small>}
                            </div>
                            <div className="field">
                                <label htmlFor="phone_number">Telefono</label>
                                <InputText
                                    id="phone_number"
                                    value={usuario.phone_number}
                                    onChange={(e) => onInputChange(e, 'phone_number')}
                                    required
                                    autoFocus
                                    className={classNames({
                                        'p-invalid': submitted && !usuario.phone_number
                                    })}
                                />
                                {submitted && !usuario.phone_number && <small className="p-invalid">Este campo es requerido</small>}
                            </div>

                            <div className="field">
                                <label htmlFor="email">Correo</label>
                                <InputText
                                    id="email"
                                    value={usuario.email}
                                    onChange={(e) => onInputChange(e, 'email')}
                                    required
                                    autoFocus
                                    className={classNames({
                                        'p-invalid': submitted && !usuario.email
                                    })}
                                />
                                {submitted && !usuario.email && <small className="p-invalid">Este campo es requerido</small>}
                            </div>

                            <div className="field">
                                <label htmlFor="email">Correo</label>
                                <InputText
                                    id="email"
                                    value={usuario.email}
                                    onChange={(e) => onInputChange(e, 'email')}
                                    required
                                    autoFocus
                                    className={classNames({
                                        'p-invalid': submitted && !usuario.email
                                    })}
                                />
                                {submitted && !usuario.email && <small className="p-invalid">Este campo es requerido</small>}
                            </div>

                            <div className="field">
                                <label htmlFor="rol">Rol</label>
                                <Dropdown
                                    id="rol"
                                    value={usuario.role}
                                    onChange={(e) => onInputChange(e.value, 'role')}
                                    options={[usuario.role]}
                                    optionLabel="name"
                                    placeholder="Seleccione un Rol"
                                    checkmark={true}
                                    highlightOnSelect={false}
                                    className={classNames({
                                        'p-invalid': submitted && !usuario.email
                                    })}
                                />
                                {submitted && !usuario.email && <small className="p-invalid">Este campo es requerido</small>}
                            </div>
                        </form>
                    </Dialog>

                    <Dialog visible={deleteProductDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {usuario && (
                                <span>
                                    ¿Está seguro de eliminar el rol <b>{usuario.name}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteProductsDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductsDialogFooter} onHide={hideDeleteProductsDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {usuario && <span>Are you sure you want to delete the selected usuarios?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
}
