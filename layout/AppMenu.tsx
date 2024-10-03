/* eslint-disable @next/next/no-img-element */

import React from 'react';
import AppMenuitem from './AppMenuitem';

import { MenuProvider } from './context/menucontext';

import { AppMenuItem } from '@/types';

const AppMenu = () => {
    const model: AppMenuItem[] = [
        {
            label: 'Inicio',
            items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/dashboard' }]
        },
        {
            label: 'Usuarios',
            items: [{ label: 'Usuarios', icon: 'pi pi-fw pi-users', to: '/usuarios/usuarios' }]
        },

        {
            label: 'Agenda de Citas',
            items: [{ label: 'Citas', icon: 'pi pi-sliders-h', to: '/citasClientes', badge: 'NEW' }]
        },
        {
            label: 'Historial Medico',
            items: [{ label: 'Historial', icon: 'pi pi-sliders-h', to: '/historial', badge: 'NEW' }]
        },
        {
            label: 'Horarios',
            items: [{ label: 'Gestión de Horarios', icon: 'pi pi-fw pi-hourglass', to: '/horarios' }]
        },
        {
            label: 'Reservas',
            items: [{ label: 'Gestion de Reservas', icon: 'pi pi-sliders-h', to: '/reservas', badge: 'NEW' }]
        },

        {
            label: 'Doctores',
            icon: 'pi pi-fw pi-briefcase',
            to: '/recursos',
            items: [
                {
                    label: 'Detalles',
                    icon: 'pi pi-fw pi-users',
                    to: '/recursos/doctors'
                },
                {
                    label: 'Especializaciones',
                    icon: 'pi pi-fw pi-users',
                    to: '/recursos/Specialization'
                }
            ]
        }
    ];

    return (
        <MenuProvider>
            <ul className="layout-menu">
                {model.map((item, i) => {
                    return !item?.seperator ? <AppMenuitem item={item} root={true} index={i} key={item.label} /> : <li className="menu-separator"></li>;
                })}
            </ul>
        </MenuProvider>
    );
};

export default AppMenu;
