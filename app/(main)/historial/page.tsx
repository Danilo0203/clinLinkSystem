'use client';
import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import axios from 'axios';

// Interfaces
interface Consultation {
  id: string;
  doctor: string;
  diagnosis: string;
  treatment: string;
  date: string;
}

interface MedicalExam {
  id: string;
  type: string;
  result: string;
  date: string;
}

interface MedicalRecord {
  id: string;
  patientId: string;
  primaryDoctorId: string;
  diagnosis: string;
  treatment: string;
  date: string;
}

const MedicalSystem = () => {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [medicalExams, setMedicalExams] = useState<MedicalExam[]>([]);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);

  // Fetch consultations
  useEffect(() => {
    axios.get('https://clinclink-bf4bg.ondigitalocean.app/api/consultation')
      .then(response => setConsultations(response.data))
      .catch(error => console.error(error));
  }, []);

  // Fetch medical exams
  useEffect(() => {
    axios.get('https://clinclink-bf4bg.ondigitalocean.app/api/medical-exam')
      .then(response => setMedicalExams(response.data))
      .catch(error => console.error(error));
  }, []);

  // Fetch medical records
  /* useEffect(() => {
    axios.get('https://clinclink-bf4bg.ondigitalocean.app/api/medical-record')
      .then(response => setMedicalRecords(response.data))
      .catch(error => console.error(error));
  }, []); */

  return (
    <div>
      <h2>Consultas Médicas</h2>
      <DataTable value={consultations}>
        <Column field="doctor" header="Doctor" />
        <Column field="diagnosis" header="Diagnóstico" />
        <Column field="treatment" header="Tratamiento" />
        <Column field="date" header="Fecha" />
      </DataTable>

      <h2>Exámenes Médicos</h2>
      <DataTable value={medicalExams}>
        <Column field="type" header="Tipo de Examen" />
        <Column field="result" header="Resultado" />
        <Column field="date" header="Fecha" />
      </DataTable>

      {/* <h2>Historiales Médicos</h2>
      <DataTable value={medicalRecords}>
        <Column field="patientId" header="ID del Paciente" />
        <Column field="primaryDoctorId" header="ID del Doctor" />
        <Column field="diagnosis" header="Diagnóstico" />
        <Column field="treatment" header="Tratamiento" />
        <Column field="date" header="Fecha" />
      </DataTable> */}
    </div>
  );
};

export default MedicalSystem;
