
import React, { useState, useRef, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Toast } from 'primereact/toast';
import { getAllSchedules, getScheduleById, createSchedule, updateSchedule, deleteSchedule } from '../../../../src/services/scheduleService';

interface Schedule {
  id: number;
  doctor_id: number;
  day_of_week: string;
  time_start: string;
  time_end: string;
}

interface ScheduleTableProps {
  schedules: Schedule[];
  setSchedules: (schedules: Schedule[]) => void;
}
/* const dt = useRef<DataTable<any>>(null); // Boton exportar

const exportCSV = () => {
    dt.current?.exportCSV();
}; */


const ScheduleTable: React.FC<ScheduleTableProps> = ({ schedules, setSchedules }) => {
  const [selectedSchedules, setSelectedSchedules] = useState<Schedule[]>([]);
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [deleteScheduleDialog, setDeleteScheduleDialog] = useState(false);
  const [editScheduleDialog, setEditScheduleDialog] = useState(false);
  const [newScheduleDialog, setNewScheduleDialog] = useState(false);
  const toast = useRef<Toast>(null);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const data = await getAllSchedules();
        setSchedules(data);
      } catch (error) {
        console.error('Error fetching schedules:', error);
      }
    };

    fetchSchedules();
  }, [setSchedules]);

  const editSchedule = async (id: number) => {
    try {
      const schedule = await getScheduleById(id.toString());
      setSchedule(schedule);
      setEditScheduleDialog(true);
    } catch (error) {
      console.error('Error fetching schedule:', error);
    }
  };

  const saveSchedule = async () => {
    if (schedule) {
      try {
        const updatedSchedule = await updateSchedule(schedule.id.toString(), schedule);
        const updatedSchedules = schedules.map((s) => (s.id === updatedSchedule.id ? updatedSchedule : s));
        setSchedules(updatedSchedules);
        setEditScheduleDialog(false);
        setSchedule(null);
        toast.current?.show({
          severity: 'success',
          summary: 'Successful',
          detail: 'Schedule Updated',
          life: 3000,
        });
      } catch (error) {
        console.error('Error updating schedule:', error);
      }
    }
  };

  const addSchedule = async () => {
    if (schedule) {
      try {
        const newSchedule = await createSchedule(schedule);
        setSchedules([...schedules, newSchedule]);
        setNewScheduleDialog(false);
        setSchedule(null);
        toast.current?.show({
          severity: 'success',
          summary: 'Successful',
          detail: 'Schedule Created',
          life: 3000,
        });
      } catch (error) {
        console.error('Error creating schedule:', error);
      }
    }
  };

  const confirmDeleteSchedule = (schedule: Schedule) => {
    setSchedule(schedule);
    setDeleteScheduleDialog(true);
  };

  const handleDeleteClick = async () => {
    if (schedule) {
      try {
        await deleteSchedule(schedule.id.toString());
        const _schedules = schedules.filter((val) => val.id !== schedule.id);
        setSchedules(_schedules);
        setDeleteScheduleDialog(false);
        setSchedule(null);
        toast.current?.show({
          severity: 'success',
          summary: 'Successful',
          detail: 'Schedule Deleted',
          life: 3000,
        });
      } catch (error) {
        console.error('Error deleting schedule:', error);
      }
    }
  };

  const newScheduleDialogFooter = (
    <>
        <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={() => setNewScheduleDialog(false)} />
        <Button label="Guardar" icon="pi pi-check" className="p-button-text" onClick={addSchedule} />
    </>
  );
  /* const rightToolbarTemplate = () => { // Boton Exportar
    return (
        <React.Fragment> */
            {/* <FileUpload mode="basic" accept="image/*" maxFileSize={1000000} chooseLabel="Importar" className="mr-2 inline-block" /> */}
      {/*       <Button label="Exportar" icon="pi pi-upload" severity="help" onClick={exportCSV} />
        </React.Fragment>
    );
}; */}

  return (
    <div>
      <h2>Gestión de Horarios</h2>
      <Button label="Añadir Horario" onClick={() => { setSchedule({ id: 0, doctor_id: 0, day_of_week: '', time_start: '', time_end: '' }); setNewScheduleDialog(true); }} />
      <DataTable value={schedules} paginator rows={10} rowsPerPageOptions={[5, 10, 20]} className="p-datatable-gridlines">
        <Column field="doctor_id" header="ID del Doctor" />
        <Column field="day_of_week" header="Día de la Semana" />
        <Column field="time_start" header="Hora de Inicio" />
        <Column field="time_end" header="Hora de Fin" />
        <Column
          body={(rowData: Schedule) => (
            <>
              <Button label="Editar" onClick={() => editSchedule(rowData.id)} />
              <Button label="Eliminar" onClick={() => confirmDeleteSchedule(rowData)} />
            </>
          )}
        />
      </DataTable>

      <Dialog header="Detalles del Horario" visible={editScheduleDialog || newScheduleDialog} footer={newScheduleDialog ? newScheduleDialogFooter : null} onHide={() => { setEditScheduleDialog(false); setNewScheduleDialog(false); }}>
        {schedule && (
          <form onSubmit={newScheduleDialog ? addSchedule : saveSchedule}>
            <div className="flex flex-column gap-2">
              <label htmlFor="doctor_id">ID del Doctor</label>
              <InputNumber id="doctor_id" value={schedule.doctor_id || 0} onValueChange={(e) => setSchedule({ ...schedule, doctor_id: e.value || 0 })} />            </div>
            <div className="flex flex-column gap-2">
              <label htmlFor="day_of_week">Día de la Semana</label>
              <InputText id="day_of_week" value={schedule.day_of_week} onChange={(e) => setSchedule({ ...schedule, day_of_week: e.target.value })} />
            </div>
            <div className="flex flex-column gap-2">
              <label htmlFor="time_start">Hora de Inicio</label>
              <InputText type='time' id="time_start" value={schedule.time_start} onChange={(e) => setSchedule({ ...schedule, time_start: e.target.value })} />
            </div>
            <div className="flex flex-column gap-2">
              <label htmlFor="time_end">Hora de Fin</label>
              <InputText type='time' id="time_end" value={schedule.time_end} onChange={(e) => setSchedule({ ...schedule, time_end: e.target.value })} />
            </div>
           
          </form>
        )}
      </Dialog>

      <Dialog header="Confirmar Eliminación" visible={deleteScheduleDialog} onHide={() => setDeleteScheduleDialog(false)}>
        <div>
          <p>¿Estás seguro de que deseas eliminar este horario?</p>
          <Button label="Sí" onClick={handleDeleteClick} />
          <Button label="No" onClick={() => setDeleteScheduleDialog(false)} />
        </div>
      </Dialog>

      <Toast ref={toast} />
    </div>
  );
};

export default ScheduleTable;
