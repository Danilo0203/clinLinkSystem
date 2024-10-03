'use client';
import { DataEspecializacionProps } from '@/types/demo';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toolbar } from 'primereact/toolbar';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { useTable } from '@/app/hooks/useCrudTable';
import React, { useRef } from 'react';
import { EspecializacionService } from '@/libs/endpoints/especializaciones/especializacionApi';

export default function PageEspecializacion() {
    const emptyEspecializacion: DataEspecializacionProps = {
        id: null,
        name: ''
    };

    const {
        data: especializaciones,
        loading,
        dialogVisible,
        deleteDialogVisible,
        record: especializacion,
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
        toast,
        errors
    } = useTable<DataEspecializacionProps>({
        service: {
            getAll: EspecializacionService.getListar,
            create: EspecializacionService.postCrear,
            update: EspecializacionService.putActualizar,
            delete: EspecializacionService.deleteEliminar
        },
        initialRecord: emptyEspecializacion,
        keyField: 'id'
    });
    console.log(especializaciones);

    const dt = useRef<DataTable<any>>(null);

    const leftToolbarTemplate = () => (
        <div className="my-2">
            <Button label="Nuevo" icon="pi pi-plus" severity="success" className="mr-2" onClick={openNew} />
        </div>
    );

    const rightToolbarTemplate = () => <Button label="Exportar" icon="pi pi-upload" severity="help" onClick={() => dt.current?.exportCSV()} />;

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Tabla de Especializaciones</h5>
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

    const codeBodyTemplate = (rowData: DataEspecializacionProps, { rowIndex }: { rowIndex: number }) => {
        return <>{first + rowIndex + 1}</>;
    };

    const actionBodyTemplate = (rowData: DataEspecializacionProps) => (
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
                    <DataTable ref={dt} value={especializaciones} paginator rows={rows} totalRecords={especializaciones.length} first={first} onPage={onPage} loading={loading} globalFilter={globalFilter} header={header}>
                        <Column field="id" header="No." body={codeBodyTemplate}></Column>
                        <Column field="name" header="Especialización" sortable></Column>
                        <Column body={actionBodyTemplate}></Column>
                    </DataTable>

                    <Dialog visible={dialogVisible} style={{ width: '450px' }} header="Especialización" modal className="p-fluid" footer={userDialogFooter} onHide={hideDialog}>
                        <form>
                            <div className="field">
                                <label htmlFor="name">Especializacion</label>
                                <InputText id="name" {...register('name', { required: true })} />
                                {errors.name && <small className="p-error">Campo requerido</small>}
                            </div>
                        </form>
                    </Dialog>

                    <Dialog visible={deleteDialogVisible} style={{ width: '450px' }} header="Confirmar" modal footer={deleteUserDialogFooter} onHide={hideDeleteDialog}>
                        <div className="confirmation-content">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {especializacion && (
                                <span>
                                    ¿Está seguro de eliminar la especializacion <b>{especializacion.name}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
}
