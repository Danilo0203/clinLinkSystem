'use client';
import { RegistroService } from '@/libs/endpoints/registro/registroApi';
import { AxiosError } from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { addLocale } from 'primereact/api';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { FloatLabel } from 'primereact/floatlabel';
import { InputMask } from 'primereact/inputmask';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Toast } from 'primereact/toast';
import { useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';

const Page = () => {
    const { register, handleSubmit, control } = useForm();
    addLocale('es', {
        firstDayOfWeek: 1,
        dayNames: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
        dayNamesShort: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
        dayNamesMin: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
        monthNames: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
        monthNamesShort: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
        today: 'Hoy',
        clear: 'Limpiar'
    });
    const toast = useRef<Toast>(null);
    const route = useRouter();
    const onSubmit = async (data: any) => {
        data = {
            ...data,
            date_of_birth: data.date_of_birth.toISOString().split('T')[0]
        };
        try {
            const res = await RegistroService.registro(data);
            if (res.success) {
                if (toast.current) {
                    toast.current.show({ severity: 'success', summary: 'Registro exitoso', detail: res.message });
                }
            }
            route.push('/login');
        } catch (error) {
            if (error instanceof AxiosError) {
                if (toast.current) {
                    toast?.current.show({ severity: 'error', summary: 'Error al registrar', detail: error.response?.data?.message });
                }
            }
        }
    };
    return (
        <div className="min-h-screen text-center py-5">
            <Toast ref={toast} />
            <h2>Formulario de Registro</h2>
            <form method="post" onSubmit={handleSubmit(onSubmit)} className="flex align-items-center justify-content-center">
                <div className="flex flex-column gap-5 py-2">
                    <FloatLabel>
                        <InputText id="username" {...register('username')} />
                        <label htmlFor="username">Usuario</label>
                    </FloatLabel>

                    <FloatLabel>
                        <InputText id="first_name" {...register('first_name')} />
                        <label htmlFor="first_name">Nombres</label>
                    </FloatLabel>

                    <FloatLabel>
                        <InputText id="last_name" {...register('last_name')} />
                        <label htmlFor="last_name">Apellidos</label>
                    </FloatLabel>

                    <FloatLabel>
                        <InputText id="email" {...register('email')} />
                        <label htmlFor="email">Correo</label>
                    </FloatLabel>

                    <FloatLabel>
                        <Controller name="password" control={control} defaultValue="" render={({ field }) => <Password {...field} inputId="password" feedback={false} toggleMask type="password" />} />
                        <label htmlFor="password">Contraseña</label>
                    </FloatLabel>

                    <FloatLabel>
                        <Controller name="password_confirmation" control={control} defaultValue="" render={({ field }) => <Password {...field} inputId="password_confirmation" feedback={false} toggleMask type="password" />} />
                        <label htmlFor="password_confirmation">Confirmar Contraseña</label>
                    </FloatLabel>

                    <div className="flex flex-column align-items-start">
                        <label htmlFor="date_of_birth">Fecha de Nacimiento</label>
                        <Calendar id="date_of_birth" locale="es" {...register('date_of_birth')} />
                    </div>

                    <FloatLabel>
                        <InputMask id="phone" mask="99999999" placeholder="99999999" {...register('phone_number')} />
                        <label htmlFor="phone">Numero de telefono</label>
                    </FloatLabel>

                    <Button label="Registrarse" type="submit" className="p-button-raised p-button-rounded p-button-primary" />
                    <div className="flex flex-column gap-1">
                        <p className="m-0">¿Ya tienes una cuenta?</p>
                        <Link href="/login">Iniciar sesión</Link>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Page;
