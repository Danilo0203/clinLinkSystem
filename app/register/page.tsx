'use client';
import React, { FormEvent, useContext, useState } from 'react';

import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { LayoutContext } from '@/layout/context/layoutcontext';
import api from '@/libs/utils';
import { signIn } from 'next-auth/react';

const Registerpage = () => {
    const [password, setPassword] = useState('Danilo.023');
    const [confirmPassword, setConfirmPassword] = useState('Danilo.023');
    const { layoutConfig } = useContext(LayoutContext);

    const containerClassName = classNames('surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden', { 'p-input-filled': layoutConfig.inputStyle === 'filled' });

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        try {
            const res = await api.post('/api/register', {
                username: formData.get('username'),
                first_name: formData.get('first_name'),
                last_name: formData.get('last_name'),
                email: formData.get('email'),
                password: formData.get('password'),
                password_confirmation: formData.get('password_confirmation'),
                phone_number: formData.get('phone_number'),
                date_of_birth: '1999-12-12'
            });
            signIn("credentials", {
                email: res.data.email,
            })
            console.log(res);
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <div className={containerClassName}>
            <div className="flex flex-column align-items-center justify-content-center">
                <img src={`/layout/images/logo-${layoutConfig.colorScheme === 'light' ? 'dark' : 'white'}.svg`} alt="Sakai logo" className="mb-5 w-6rem flex-shrink-0" />
                <div
                    style={{
                        borderRadius: '56px',
                        padding: '0.3rem',
                        background: 'linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)'
                    }}
                >
                    <div className="w-full surface-card py-8 px-5 sm:px-8" style={{ borderRadius: '53px' }}>
                        <div className="text-center mb-5">
                            <img src="/layout/images/Logo.png" alt="Image" height="50" className="mb-3" />
                            {/* <div className="text-900 text-3xl font-medium mb-3">Welcome, Isabel!</div> */}
                            <span className="text-600 font-medium">Sign in to continue</span>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <label htmlFor="username" className="block text-900 text-xl font-medium mb-2">
                                Usuario
                            </label>
                            <InputText id="username" type="text" placeholder="Usuario" className="w-full md:w-30rem mb-5" style={{ padding: '1rem' }} name="username" value="dCalderonPrueba" />

                            <label htmlFor="first_name" className="block text-900 font-medium text-xl mb-2">
                                Nombres
                            </label>
                            <InputText name="first_name" id="first_name" placeholder="Nombres" className="w-full mb-5" value="Danilo"></InputText>

                            <label htmlFor="first_name" className="block text-900 font-medium text-xl mb-2">
                                Apellidos
                            </label>
                            <InputText name="last_name" id="last_name" placeholder="Apellidos" className="w-full mb-5" value="Calderon"></InputText>

                            <label htmlFor="first_name" className="block text-900 font-medium text-xl mb-2">
                                Correo
                            </label>
                            <InputText name="email" id="email" placeholder="Correo" className="w-full mb-5" value="email@email.com"></InputText>

                            <label htmlFor="first_name" className="block text-900 font-medium text-xl mb-2">
                                Contraseña
                            </label>
                            <Password name="password" id="password" placeholder="Contraseña" className="w-full mb-5" toggleMask value={password} onChange={(e) => setPassword(e.target.value)}></Password>

                            <label htmlFor="first_name" className="block text-900 font-medium text-xl mb-2">
                                Confirmar Contraseña
                            </label>
                            <Password
                                name="password_confirmation"
                                id="password_confirmation"
                                placeholder="Confrimar Contraseña"
                                className="w-full mb-5"
                                toggleMask
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            ></Password>

                            <label htmlFor="first_name" className="block text-900 font-medium text-xl mb-2">
                                Numero de Telefono
                            </label>
                            <InputText name="phone_number" id="phone_number" placeholder="Numero de telefono" className="w-full mb-5" value="12345678"></InputText>

                            <Button label="Sign Up" className="w-full p-3 text-xl" type="submit"></Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Registerpage;
