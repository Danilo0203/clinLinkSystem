'use client';
import { AxiosError } from 'axios';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { FloatLabel } from 'primereact/floatlabel';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import React from 'react';
import { useForm, Controller } from 'react-hook-form';

const LogingPage = () => {
    const router = useRouter();
    const { register, handleSubmit, control } = useForm();
    const onSubmit = async (data: any) => {
        try {
            const res = await signIn('credentials', {
                email: data.email,
                password: data.password,
                password_confirmation: data.password_confirmation,
                redirect: false
            });
            if (res?.ok) return router.push('/dashboard');
        } catch (error) {
            if (error instanceof AxiosError) {
                console.error(error.response?.data);
            }
        }
    };
    return (
        <div className="min-h-screen text-center py-5">
            <h2>Formulario de Inicio de sesión</h2>
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
