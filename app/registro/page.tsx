"use client";
import React, { useState } from "react";
import { InputText } from "primereact/inputtext";
import { FloatLabel } from 'primereact/floatlabel';
import { Password, PasswordState } from 'primereact/password';
import { RiLockPasswordLine } from "react-icons/ri";
import { InputMask } from 'primereact/inputmask';
import { Calendar } from 'primereact/calendar';
import Link from 'next/link';
import {useForm, SubmitHandler} from 'react-hook-form'
import { Button } from 'primereact/button';

type Inputs ={
  username: string;
  apellido: string;
  email: string;
  password: PasswordState;
  fecha: Date;
  phone: string;
};



export default function Registro(){
 
    const [isFormValid, setIsFormValid] = useState(false);
   

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      
      setFormData({...formData,[e.target.name]: e.target.value});

      const allFieldsValid = Object.values(errors).every((error) => !error); setIsFormValid(allFieldsValid);
    };
    const {register, handleSubmit, watch, formState: { errors }, } = useForm<Inputs>()
    const onSubmit:  SubmitHandler<Inputs> = (data) => {
      if (formData.username && formData.apellido && formData.email && formData.password && formData.fecha && formData.phone){
        window.location.href = '/login';
      }

    }
    const [formData, setFormData] = useState({
      username: '',
      apellido: '',
      email: '',
      password: '',
      phone: null,
      fecha: null,
      
     
     
    });
    return(
      
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
                        <div className="flex felx-col items-center">
                            <div className='relative w-64 p-3 mb-4 flex items-center'>
                              <form action="" onSubmit={handleSubmit(onSubmit)} className="space-y-7 ">
                                
                           
                                  <FloatLabel>
                                    <InputText id="username" className="" type="text" {...register('username', {required: true, maxLength:100}) } value={formData.username}
                                     onChange={handleInputChange}/>
                                    <span>{errors?.username?.type === 'required' && 'El campo es requerido.'}</span>
                                   
                                  
                                    <label htmlFor="username" className="flex">Nombre</label>
                                   
                                  </FloatLabel>
                                  <FloatLabel>
                                    <InputText id="apellido" type="text" {...register('apellido', {required: true, maxLength:100, pattern: /^[A-Za-z]+$/i }) } className=""
                                    value={formData.apellido}  onChange={handleInputChange} />
                                       <span>{errors?.apellido?.type === 'required' && 'El campo es requerido.'}</span>
                                  
                                    <label htmlFor="apellido" className="flex">Apellidos</label>
                                  </FloatLabel>
                                  <FloatLabel>
                                    <InputText id="email" type="email"  className=""  {...register('email', {required: true, maxLength:100,}) }
                                    value={formData.email}  onChange={handleInputChange} />
                                       <span>{errors?.email?.type === 'required' && 'El campo es requerido.'}</span>
                                  
                                    <label htmlFor="email" className="flex">E-mail</label>
                                  </FloatLabel>

                                  <FloatLabel>
                                   <Password id="password" type="password"  {...register('password', {required: false, maxLength:4,})}  feedback={false} tabIndex={1} 
                                   value={formData.password}  onChange={handleInputChange}/>   
                                      <span>{errors?.password?.type === 'required' && 'El campo es requerido.'}</span>
                                    <label htmlFor="password" className="flex"><RiLockPasswordLine className='text-gray-400 mr-2 flex-1' />Contraseña: </label>
                                  </FloatLabel>

                                  <Calendar inputId="fecha" showIcon placeholder="Fecha de Nacimiento" 
                                  value={formData.fecha || '' ? formData.fecha : undefined } onChange={(e) => handleInputChange} />
                                     <span>{errors?.fecha?.type === 'required' && 'El campo es requerido.'}</span>

                                  <FloatLabel>
                                  <label htmlFor="phone" className=" block mb-2">Telefono</label>
                                  <span>{errors?.phone?.type === 'required' && 'El campo es requerido.'}</span>
                                  <InputMask id="phone" mask="(999) 9999-9999" {...register('phone', {required: true, maxLength:11,})} 
                                    value={formData.phone || ''} onChange={(e) => handleInputChange}></InputMask>
                                  </FloatLabel>
                                      {/*   <button   type="submit" disabled={!isFormValid} className="border-2 border-lime-400 rounded-full px-12 py-2 inline-block font-semibold hover:bg-black hover:text-white" >Registrate
                                           <Link type="submit" 
                                            href={{
                                                pathname: '/login',
                                                query: { name: 'page' },
                                            }}
                                        > 

                                        </Link>
                                </button> */}
                                <Button disabled={!isFormValid} label="Link"  onClick={() =>  window.open('/login', 'page')} type="submit" />
                                       
  
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




        