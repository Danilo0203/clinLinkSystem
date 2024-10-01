
'use client';
import React, { useState, useRef } from 'react';
import ScheduleTable from '../horarios/components/ScheduleTable'; 
import { Button } from 'primereact/button';

interface Schedule {
  id: number;
  doctor_id: number;
  day_of_week: string;
  time_start: string;
  time_end: string;
}


const HomePage: React.FC = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);

  return (
    <div>
      <h1>Bienvenido a la Gestión de Horarios</h1>
      <ScheduleTable schedules={schedules} setSchedules={setSchedules} />
    </div>
  );
};

export default HomePage;
