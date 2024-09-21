"use client";
import React, { useState } from "react";
import { InputText } from "primereact/inputtext";
import { FloatLabel } from 'primereact/floatlabel';
import { Password} from 'primereact/password';
import { RiLockPasswordLine } from "react-icons/ri";
import { InputMask } from 'primereact/inputmask';
import { Calendar } from 'primereact/calendar';
import { useForm, FieldError, FieldErrorsImpl, Merge} from 'react-hook-form'
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';




export default function Registro() {

  const { register, handleSubmit, formState: { errors } } = useForm()
  const onSubmit = handleSubmit((data) => {
    console.log(data);
  })
  const getErrorMessage = (error: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined): string => {
    if (error) {
      return (error as FieldError).message || '';
    }
    return '';
  };
  /* if (formData.username && formData.apellido && formData.email && formData.password && formData.fecha && formData.phone){

    window.location.href = '/login';
  } */



  return (

    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-white">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <div className="bg-gray-200 rounded-2xl shadow-2xl flex w-2/3 max-w-4xl min-w-96">
          <div className="w-full max-w-3xl p-5 flex justify-center"  >
            <div className="text-left font-bold h-10">
              Registrate

            </div>
            <div className="py-10">
              <h2 className="text-3xl font-bold  mb-2 ">
                <span className="text-left text-lime-400" >Clin</span>Click
              </h2>
              <div className="border-2 w-10 border-lime-400 inline-block mb-2"></div>
              <p className='text-gray-400 my-3'>Usuario</p>
              <div className="flex-col items-center">
                <div className=' w-80 p-3 mb-4 flex items-center justify-center'>

                  <form onSubmit={onSubmit} className="space-y-7 ">

                    <div className="flex flex-wrap align-items-center gap-2" >
                      <FloatLabel >
                        <InputText id="username" className="w-72" type="text" {...register('username', 
                          { required: { value: true, message: "Nombre es Requerido" }, minLength:{value: 4, message: "Nombre debe tener al menos 4 carácteres"} })} />
                        <label htmlFor="username">Nombre</label>
                      </FloatLabel>
                      {errors.username && (
                                            <span>
                                              <Message severity="error" text={getErrorMessage(errors.username)} />
                                            </span>
                                          )} 
                    </div>


                    <div className="flex flex-wrap align-items-center gap-2" >
                      <FloatLabel>
                        <InputText id="apellido" type="text" {...register('apellido', { required: true, maxLength: 100, pattern: /^[A-Za-z]+$/i })} className="w-72" />
                        <label htmlFor="apellido" className="flex">Apellidos</label>
                      </FloatLabel>
                      <span >{errors?.apellido?.type === 'required' && (<Message className="text-sm" severity="error" text="El campo es requerido." />)}</span>
                    </div>

                    <div className="flex flex-wrap align-items-center gap-2" >
                      <FloatLabel>
                        <InputText id="email" type="email" {...register('email', { required: true, maxLength: 100, })} className="w-72" />
                        <label htmlFor="email" className="flex">E-mail</label>
                      </FloatLabel>
                      <span>{errors?.email?.type === 'required' && (<Message severity="error" text="El campo es requerido." />)}</span>

                    </div>

                    
                    <div className="flex flex-wrap align-items-center gap-2 w-72">
                    <FloatLabel>
                      <InputText type="password"  id="password" {...register('password', { required: "El campo es requerido" })} className="w-72 mr-0"  />
                      <label htmlFor="password" className="flex "><RiLockPasswordLine className='text-gray-400 mr-2 ' />Contraseña: </label>
                    </FloatLabel>
                    {errors.password && (<span> <Message severity="error" text={getErrorMessage(errors.password)}  /></span>)}

                    </div>
                   
                    <div className="flex flex-wrap align-items-center gap-2">
                      <FloatLabel>
                        <Calendar   showTime={false} inputId="fecha" {...register('fecha', { required: true })} className="w-72" />
                        <label htmlFor="fecha">Fecha</label>
                      </FloatLabel>
                      <span>{errors?.fecha?.type === 'required' && (<Message severity="error" text="El campo es requerido." />)}</span>

                    </div>
                    <div className="flex flex-wrap align-items-center gap-2">
                      <FloatLabel>
                        <label htmlFor="phone" className="font-bold block mb-2"  >Phone</label>
                        <InputMask type="tel" id="phone" mask="(999) 9999-9999"  {...register('phone', { required: true })} className="w-72"></InputMask>
                      </FloatLabel>
                      <span>{errors?.phone?.type === 'required' && (<Message severity="error" text="El campo es requerido." />)}</span>

                    </div>

                    <Button label="Resgistrate" severity="success" rounded type="submit" />



                  </form>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>


    </div>


  )
}




