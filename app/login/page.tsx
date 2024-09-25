"use client";
import React, { useState } from "react";
import { FaRegEnvelope } from 'react-icons/fa'
import { InputText } from "primereact/inputtext";
import { FloatLabel } from 'primereact/floatlabel';
import { Password } from 'primereact/password';
import { RiLockPasswordLine } from "react-icons/ri";
import { Button } from 'primereact/button';
import Link from 'next/link';
import {useForm, } from 'react-hook-form';
import { Dialog } from 'primereact/dialog';
import ForgotPasswordModal from "../contraseña/page";

export default function login() {
    const { register, handleSubmit,formState: { errors }, } = useForm()
    const onSubmit = handleSubmit((data) =>{
      console.log(data);
    } )
    //Variables Modal
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

    const handleOpenModal = () => {
        setIsModalVisible(true);
    };

    const handleCloseModal = () => {
        setIsModalVisible(false);
    };
    
    return (
      
      <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-100">
        
        <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
            <div className="bg-white rounded-2xl shadow-2xl flex w-2/3 max-w-4xl">
                <div className="w-3/5 max-w-3xl p-5"  >
                    <div className="text-left font-bold">
                        <span className="text-left text-lime-400" >Clin</span>Click
                    </div>
                    <div className="py-10">
                        <h2 className="text-3xl font-bold text-lime-400 mb-2 ">
                            Inicia Sesion
                        </h2>
                        <div className="border-2 w-10 border-lime-400 inline-block mb-2"></div>
                        <p className='text-gray-400 my-3'>Usuario</p>
                        <div className=" flex flex-col items-center justify-center">
                            <div className='relative w-64 p-3 mb-4 flex items-center'>
                              <form action="" onSubmit={onSubmit} className="space-y-7 w-full flex-col  ">
                           
                                  <FloatLabel>
                                    <InputText id="username"  type="email" className="" {...register('username', {required: true, maxLength:60, minLength:8})} />
                                  
                                    <label htmlFor="username" className="flex"> <FaRegEnvelope className='text-gray-400 mr-2 flex-1' /> Usuario</label>
                                  </FloatLabel>
                                  <FloatLabel>
                                   <InputText id="password" type="password" {...register('password', { required: "El campo es requerido" })} />   
                                    <label htmlFor="password" className="flex"><RiLockPasswordLine className='text-gray-400 mr-2 flex-1' />Contraseña: </label>
                                  </FloatLabel>
                                  <div className="flex w-64 mb-5">
                                  
                                  <Link href={''} onClick={handleOpenModal} className="text-sm"
                                    > ¿Olvido su contraseña? </Link>
                                      
                                  </div>
                                  <ForgotPasswordModal visible={isModalVisible} onHide={handleCloseModal} />
                                  


                                  <div>
                                   <Button  className="bg-lime-400 text-white px-4 py-2 rounded" label="Login" link  />
                                   
                                 </div>
                                    
                              </form>
                            </div>
                        </div>
                    </div>
                </div>
                <div className=" max-w-3xl p-5 w-2/5 bg-lime-400 text-white  rounded-br-2xl py-36 px-12" >
                    <h2 className="text-3xl font-bold mb-2">Bienvenido</h2>
                    <div className="border-2 w-10 border-white inline-block mb-2"> 
                    </div>
                    <div>
                    <p className="mb-10">Registrate, empieza una vida sana con nosotros</p>
                    <Link className="border-2 border-white rounded-full px-12 py-2 inline-block font-semibold hover:bg-white hover:text-black"
                         href={{
                            pathname: '/registro',
                            query: {name: 'page'},
                        }}
                    > Registrate
                       
                    </Link>

                    </div>
                
                </div>
            </div>
           
        </main>
       
      </div>
      

      
    )
}



