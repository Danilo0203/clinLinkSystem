'use client';

import React, { useEffect, useState, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { getAllSpecializations, createSpecialization, updateSpecialization, deleteSpecialization } from '../../../../../src/services/specializationService';
import { AxiosError } from 'axios';

interface Specialization {
    id?: string;
    name: string;
    // otros campos relevantes
}

const SpecializationManagement: React.FC = () => {
    const [specializations, setSpecializations] = useState<Specialization[]>([]);
    const [selectedSpecialization, setSelectedSpecialization] = useState<Specialization | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isDialogVisible, setIsDialogVisible] = useState(false);

    useEffect(() => {
        fetchSpecializations();
    }, []);

    const fetchSpecializations = () => {
        getAllSpecializations()
            .then(data => setSpecializations(data))
            .catch((error: AxiosError) => console.error('Error fetching specializations:', error));
    };

    const handleAdd = () => {
        setSelectedSpecialization({ name: '' });
        setIsEditing(true);
        setIsDialogVisible(true);
    };

    const handleDelete = (id: string) => {
        deleteSpecialization(id)
            .then(() => setSpecializations(specializations.filter(specialization => specialization.id !== id)))
            .catch((error: AxiosError) => console.error('Error deleting specialization:', error));
    };

    const handleEdit = (specialization: Specialization) => {
        setSelectedSpecialization(specialization);
        setIsEditing(true);
        setIsDialogVisible(true);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSelectedSpecialization(prevState => prevState ? { ...prevState, [name]: value } : null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedSpecialization) {
            const method = selectedSpecialization.id ? 'update' : 'create';
            const serviceFunction = method === 'update' ? updateSpecialization : createSpecialization;

            serviceFunction(selectedSpecialization.id || '', selectedSpecialization)
                .then(() => {
                    fetchSpecializations();
                    setSelectedSpecialization(null);
                    setIsEditing(false);
                    setIsDialogVisible(false);
                })
                .catch((error: AxiosError) => console.error('Error saving specialization:', error));
        }
    };

    const dialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={() => setIsDialogVisible(false)} />
            <Button label="Guardar" icon="pi pi-check" className="p-button-text" onClick={handleSubmit} />
        </>
    );

    /* const dt = useRef<DataTable<any>>(null); //Boton Exportar

    const exportCSV = () => {
        dt.current?.exportCSV();
    };
    const rightToolbarTemplate = () => {
        return (
            <React.Fragment> */
                {/* <FileUpload mode="basic" accept="image/*" maxFileSize={1000000} chooseLabel="Importar" className="mr-2 inline-block" /> */}
             {/*    <Button label="Exportar" icon="pi pi-upload" severity="help" onClick={exportCSV} />
            </React.Fragment>
        );
    }; */}

    return (
        <div>
            <h2>Gestión de Especializaciones</h2>
            <Button label="Añadir Especialización" onClick={handleAdd} />
            <DataTable
                value={specializations}
                paginator
                rows={10}
                rowsPerPageOptions={[5, 10, 20]}
                className="p-datatable-gridlines"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks"
            >
                <Column field="name" header="Nombre" />
                <Column
                    body={(rowData: Specialization) => (
                        <>
                            <Button label="Editar" onClick={() => handleEdit(rowData)} />
                            <Button label="Eliminar" onClick={() => handleDelete(rowData.id!)} />
                        </>
                    )}
                />
            </DataTable>

            <Dialog header="Detalles de la Especialización" visible={isDialogVisible} footer={dialogFooter} onHide={() => setIsDialogVisible(false)}>
                {selectedSpecialization && (
                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-column gap-2">
                            <label htmlFor="name">Nombre</label>
                            <InputText id="name" name="name" value={selectedSpecialization.name} onChange={handleChange} />
                        </div>
                    </form>
                )}
            </Dialog>
        </div>
    );
};

export default SpecializationManagement;
