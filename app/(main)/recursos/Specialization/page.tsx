// src/pages/index.tsx o src/index.tsx
import React from 'react';
import SpecializationManagement from './components/DoctorSpecializaciones'; // Ajusta la ruta según sea necesario

const HomePage: React.FC = () => {
    return (
        <div>
            <h1>Bienvenido a la Gestión de Especializaciones</h1>
            <SpecializationManagement />
        </div>
    );
};

export default HomePage;
