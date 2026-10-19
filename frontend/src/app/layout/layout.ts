import { Component, inject } from "@angular/core";
import { RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";
import { Button } from "primeng/button";
import { AuthStore, UsuarioToken } from "../auth/auth-store";
import { Roles } from "../shared/roles";

interface OpcionMenu {
    etiqueta: string;
    ruta: string;
    icono: string;
}

@Component({
    selector: "app-layout",
    templateUrl: "./layout.html",
    styleUrl: "./layout.css",
    imports: [RouterOutlet, RouterLink, RouterLinkActive, Button]
})
export class Layout {

    private readonly authStore: AuthStore = inject(AuthStore);

    readonly usuario: UsuarioToken | null = this.authStore.obtenerUsuario();

    readonly opcionesMenu: OpcionMenu[] = this.obtenerOpcionesMenu();

    cerrarSesion(): void {
        this.authStore.cerrarSesion();
    }

    /**
     * Cada rol ve únicamente las opciones que tiene habilitadas.
     */
    private obtenerOpcionesMenu(): OpcionMenu[] {

        switch (this.usuario?.rol) {
            case Roles.PACIENTE:
                return [{ etiqueta: "Mis turnos", ruta: "/mis-turnos", icono: "pi pi-calendar" }];
            case Roles.MEDICO:
                return [{ etiqueta: "Mi agenda", ruta: "/agenda", icono: "pi pi-calendar" }];
            case Roles.ADMINISTRADOR:
                return [
                    { etiqueta: "Turnos", ruta: "/reservas", icono: "pi pi-calendar" },
                    { etiqueta: "Médicos", ruta: "/medicos", icono: "pi pi-user" }
                ];
            default:
                return [];
        }
    }

}
