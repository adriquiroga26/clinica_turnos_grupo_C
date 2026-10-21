import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { AuthStore } from './auth/auth-store';
import { authGuard, rolGuard } from './auth/auth-guard';
import { Roles, rutaInicialPorRol } from './shared/roles';
import { Layout } from './layout/layout';
import { ReservasLista } from './turnos/reservas-lista/reservas-lista';
import { AgendaMedico } from './turnos/agenda-medico/agenda-medico';
import { MedicosLista } from './turnos/medicos-lista/medicos-lista';
import { InicioAdmin } from './turnos/inicio-admin/inicio-admin';

export const routes: Routes = [
    { path: "login", component: Login },
    {
        path: "",
        component: Layout,
        canActivate: [authGuard],
        children: [
            // La raíz envía a cada usuario a su pantalla de inicio según el rol
            { path: "", pathMatch: "full", redirectTo: () => rutaInicialPorRol(inject(AuthStore).obtenerRol()) },
            { path: "inicio", component: InicioAdmin, canActivate: [rolGuard(Roles.ADMINISTRADOR)] },
            { path: "mis-turnos", component: ReservasLista, canActivate: [rolGuard(Roles.PACIENTE)] },
            { path: "reservas", component: ReservasLista, canActivate: [rolGuard(Roles.ADMINISTRADOR)] },
            { path: "medicos", component: MedicosLista, canActivate: [rolGuard(Roles.ADMINISTRADOR)] },
            { path: "agenda", component: AgendaMedico, canActivate: [rolGuard(Roles.MEDICO)] }
        ]
    },
    { path: "**", redirectTo: "" }
];
