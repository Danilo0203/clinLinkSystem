'use client';
import { AxiosError } from 'axios';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { FloatLabel } from 'primereact/floatlabel';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Toast } from 'primereact/toast';
import React, { useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';

const LogingPage = () => {
    const router = useRouter();
    const { register, handleSubmit, control } = useForm();
    const toast = useRef<Toast>(null);
    const onSubmit = async (data: any) => {
        try {
            const res = await signIn('credentials', {
                email: data.email,
                password: data.password,
                password_confirmation: data.password_confirmation,
                redirect: false
            });
            console.log(res);

            if (res?.ok === false) {
                if (toast.current) {
                    toast.current.show({ severity: 'error', summary: 'Error al iniciar sesión', detail: res.error });
                }
                return;
            }
            if (res?.ok) return router.push('/dashboard');
        } catch (error) {
            if (error instanceof AxiosError) {
                if (toast.current) {
                    toast.current.show({ severity: 'error', summary: 'Error al iniciar sesión', detail: error.message });
                }
                console.error(error.response?.data);
            }
        }
    };
    return (
        <div className="min-h-screen text-center py-5">
            <Toast ref={toast} />
            <h2>Inicio de sesión</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="flex align-items-center justify-content-center">
                <div className="flex flex-column gap-5 py-2">
                    <FloatLabel>
                        <InputText id="email" {...register('email')} />
                        <label htmlFor="email">Correo</label>
                    </FloatLabel>

                    <FloatLabel>
                        <Controller
                            name="password"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <Password
                                    {...field}
                                    inputId="password"
                                    feedback={false}
                                    toggleMask
                                    type="password" // Cambiado a "password" para mayor seguridad
                                />
                            )}
                        />
                        <label htmlFor="password">Contraseña</label>
                    </FloatLabel>

                    <FloatLabel>
                        <Controller
                            name="password_confirmation"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <Password
                                    {...field}
                                    inputId="password_confirmation"
                                    feedback={false}
                                    toggleMask
                                    type="password" // Cambiado a "password" para mayor seguridad
                                />
                            )}
                        />
                        <label htmlFor="password_confirmation">Confirmar Contraseña</label>
                    </FloatLabel>
                    <Button label="Iniciar Sesión" type="submit" className="p-button-raised p-button-rounded p-button-primary" />
                    <Link href="/register">Registrarse</Link>
                </div>
            </form>
        </div>
    );
};

export default LogingPage;
