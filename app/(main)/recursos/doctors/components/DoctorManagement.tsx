'use client';

import React, { useEffect, useState, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputNumber, InputNumberChangeEvent } from 'primereact/inputnumber';
import { getAllDoctorDetails, createDoctorDetail, updateDoctorDetail, deleteDoctorDetail } from '../../../../../src/services/doctorDetailService';
import { AxiosError } from 'axios';

interface DoctorDetail {
    id?: string;
    name: string;
    license: string;
    yearsOfExperience: number;
    specialty: string;

}

const DoctorManagement: React.FC = () => {
    const [doctors, setDoctors] = useState<DoctorDetail[]>([]);
    const [selectedDoctor, setSelectedDoctor] = useState<DoctorDetail | null>(null);
    const [selectedDoctors, setSelectedDoctors] = useState<DoctorDetail[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [isDialogVisible, setIsDialogVisible] = useState(false);

    useEffect(() => {
        fetchDoctors();
    }, []);

    const fetchDoctors = () => {
        getAllDoctorDetails()
            .then(data => setDoctors(data))
            .catch((error: AxiosError) => console.error('Error fetching doctor details:', error));
    };

    const handleAdd = () => {
        setSelectedDoctor({ name: '', license: '', yearsOfExperience: 0, specialty: '' });
        setIsEditing(true);
        setIsDialogVisible(true);
    };

    const handleDelete = (id: string) => {
        deleteDoctorDetail(id)
            .then(() => setDoctors(doctors.filter(doctor => doctor.id !== id)))
            .catch((error: AxiosError) => console.error('Error deleting doctor detail:', error));
    };

    const handleEdit = (doctor: DoctorDetail) => {
        setSelectedDoctor(doctor);
        setIsEditing(true);
        setIsDialogVisible(true);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement> | InputNumberChangeEvent) => {
        if ('target' in e) {
            const { name, value } = e.target;
            setSelectedDoctor(prevState => prevState ? { ...prevState, [name]: value } : null);
        } else {
            const { value } = e;
            const name = (e.originalEvent.target as HTMLInputElement).name;
            setSelectedDoctor(prevState => prevState ? { ...prevState, [name]: value } : null);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedDoctor) {
            const method = selectedDoctor.id ? 'update' : 'create';
            const serviceFunction = method === 'update' ? updateDoctorDetail : createDoctorDetail;

            serviceFunction(selectedDoctor.id || '', selectedDoctor)
                .then(() => {
                    fetchDoctors();
                    setSelectedDoctor(null);
                    setIsEditing(false);
                    setIsDialogVisible(false);
                })
                .catch((error: AxiosError) => console.error('Error saving doctor detail:', error));
        }
    };

    const dialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={() => setIsDialogVisible(false)} />
            <Button label="Guardar" icon="pi pi-check" className="p-button-text" onClick={handleSubmit} />
        </>
    );
   /*  const dt = useRef<DataTable<any>>(null); // boton exportar

    const exportCSV = () => {
        dt.current?.exportCSV();
    };
    const rightToolbarTemplate = () => {
        return (
            <React.Fragment> */
                {/* <FileUpload mode="basic" accept="image/*" maxFileSize={1000000} chooseLabel="Importar" className="mr-2 inline-block" /> */}
         /*        <Button label="Exportar" icon="pi pi-upload" severity="help" onClick={exportCSV} />
            </React.Fragment>
        );
    };
 */
    return (
        <div >
            <h2>Gestión de Doctores</h2>
            <Button label="Añadir Doctor" onClick={handleAdd} />
            <DataTable
                value={doctors}
                paginator
                rows={10}
                rowsPerPageOptions={[5, 10, 20]}
                className="p-datatable-gridlines"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks"
            >
                <Column field="name" header="Nombre" />
                <Column field="license" header="Licencia" />
                <Column field="yearsOfExperience" header="Años de Experiencia" />
                <Column field="specialty" header="Especialidad" />
                <Column
                    body={(rowData: DoctorDetail) => (
                        <>
                            <Button label="Editar" onClick={() => handleEdit(rowData)} />
                            <Button label="Eliminar" onClick={() => handleDelete(rowData.id!)} />
                        </>
                    )}
                />
            </DataTable>

            <Dialog header="Detalles del Doctor" visible={isDialogVisible} footer={dialogFooter} onHide={() => setIsDialogVisible(false)}>
                {selectedDoctor && (
                    <form onSubmit={handleSubmit} >
                        <div className="flex flex-column gap-2">
                            <label htmlFor="name">Nombre</label>
                            <InputText id="name" name="name" value={selectedDoctor.name} onChange={handleChange} />
                        </div>
                        <div className="flex flex-column gap-2">
                            <label htmlFor="license">Licencia</label>
                            <InputNumber id="license" name="license" value={Number(selectedDoctor.license)} onChange={handleChange} useGrouping={false} />
                        </div>
                        <div className="flex flex-column gap-2">
                            <label htmlFor="yearsOfExperience">Años de Experiencia</label>
                            <InputNumber id="yearsOfExperience" name="yearsOfExperience" value={Number(selectedDoctor.yearsOfExperience)} onChange={handleChange} useGrouping={false} />
                        </div>
                        <div className="flex flex-column gap-2">
                            <label htmlFor="specialty">Especialidad</label>
                            <InputText id="specialty" name="specialty" value={selectedDoctor.specialty} onChange={handleChange} />
                        </div>
                    </form>
                )}
            </Dialog>
        </div>
    );
};

export default DoctorManagement;
