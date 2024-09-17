"use client";
import React, { useState } from "react";
import { FaRegEnvelope } from 'react-icons/fa'
import { InputText } from "primereact/inputtext";
import { FloatLabel } from 'primereact/floatlabel';
import { Password } from 'primereact/password';
import { RiLockPasswordLine } from "react-icons/ri";
import { Button } from 'primereact/button';
import Link from 'next/link';


export default function login() {
    const [ value,setValue] = useState('');
    const [passwordValue, setPasswordValue] = useState('');
    const handleSubmit = (e:React.FormEvent)=>{e.preventDefault}
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
                        <div className="flex felx-col items-center">
                            <div className='relative w-64 p-3 mb-4 flex items-center'>
                              <form action="" onSubmit={handleSubmit} className="space-y-7 ">
                           
                                  <FloatLabel>
                                    <InputText id="username" value={value} onChange={(e) => setValue(e.target.value)} type="email" className="" />
                                  
                                    <label htmlFor="username" className="flex"> <FaRegEnvelope className='text-gray-400 mr-2 flex-1' /> Usuario</label>
                                  </FloatLabel>
                                  <FloatLabel>
                                   <Password id="password" value={passwordValue} onChange={(e) => setPasswordValue(e.target.value)} feedback={false} tabIndex={1} />   
                                    <label htmlFor="password" className="flex"><RiLockPasswordLine className='text-gray-400 mr-2 flex-1' />Contraseña: </label>
                                  </FloatLabel>
                                  <div className="flex w-64 mb-5">
                                      <a href="#" className="text-xs">¿Olvido su contraseña?</a>
                                      
                                  </div>
                                  <div>
                                   <Button label="" link onClick={() => window.open('/app/login/registro.tsx', '_blank')} />
                                   <a href="/app/login/registro.tsx" target="_blank" rel="noopener noreferrer" className="p-button font-bold">
                                    Login
                                  </a>
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



