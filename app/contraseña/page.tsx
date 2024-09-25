"use client";
import React from "react";
import { Dialog } from 'primereact/dialog';
import { InputText } from "primereact/inputtext";
import { Button } from 'primereact/button';
import { useForm, FieldError, FieldErrorsImpl, Merge } from 'react-hook-form';

interface ForgotPasswordModalProps {
    visible: boolean;
    onHide: () => void;
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ visible, onHide }) => {
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const newPassword = watch('newPassword');

    const onSubmit = (data: any) => {
        console.log(data);
        onHide(); // Cerrar el modal después de enviar el formulario
    };
    //Validaciones para obtener un mensaje en un campo especifico y puede no estar presente
    const getErrorMessage = (error: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined): string => {
        if (error) {
            return (error as FieldError).message || '';
        }
        return '';
    };

    return (
        <Dialog
            visible={visible}
            modal
            onHide={onHide}
        >
            <div className="flex-col px-8 py-5 gap-4 bg-white" style={{ borderRadius: '12px' }}>
                <div className="text-left font-bold">
                    <span className="text-left text-lime-400">Clin</span>Click
                </div>
                <h2 className="text-xl mb-4">Recuperar Contraseña</h2>
                <p>Ingrese su correo electrónico para recibir instrucciones.</p>
                <br />
                <form onSubmit={handleSubmit(onSubmit)}>
                    <InputText 
                        type="email" 
                        className="border p-2 mb-4 w-full" 
                        placeholder="Correo electrónico" 
                        {...register('email', { required: 'Correo electrónico es requerido' })} 
                    />
                    {errors.email && <span className="text-red-500">{getErrorMessage(errors.email)}</span>}
                    
                    <InputText 
                        type="password" 
                        className="border p-2 mb-4 w-full" 
                        placeholder="Contraseña Nueva" 
                        {...register('newPassword', { required: 'Contraseña nueva es requerida' })} 
                    />
                    {errors.newPassword && <span className="text-red-500">{getErrorMessage(errors.newPassword)}</span>}
                    
                    <InputText 
                        type="password" 
                        className="border p-2 mb-4 w-full" 
                        placeholder="Reingrese su nueva contraseña" 
                        {...register('confirmPassword', { 
                            required: 'Reingrese su nueva contraseña es requerida',
                            validate: value => value === newPassword || 'Las contraseñas no coinciden'
                        })} 
                    />
                    {errors.confirmPassword && <span className="text-red-500">{getErrorMessage(errors.confirmPassword)}</span>}
                    
                    <Button type="submit" label="Enviar" className="bg-blue-500 text-white px-4 py-2 rounded" />
                    <Button label="Cancelar" className="bg-gray-500 text-white px-4 py-2 rounded ml-2" onClick={onHide} />
                </form>
            </div>
        </Dialog>
    );
};

export default ForgotPasswordModal;
