import { Component, inject } from "@angular/core";
import { RouterLink, RouterOutlet } from "@angular/router";
import { Button } from "primeng/button";
import { AuthStore, UsuarioToken } from "../auth/auth-store";
import { Roles, rutaInicialPorRol } from "../shared/roles";

@Component({
    selector: "app-layout",
    templateUrl: "./layout.html",
    styleUrl: "./layout.css",
    imports: [RouterOutlet, RouterLink, Button]
})
export class Layout {

    private readonly authStore: AuthStore = inject(AuthStore);

    readonly usuario: UsuarioToken | null = this.authStore.obtenerUsuario();

    /** Al tocar el título se vuelve a la pantalla de inicio del rol. */
    readonly rutaInicio: string = rutaInicialPorRol(this.usuario?.rol ?? null);

    readonly esAdministrador: boolean = this.usuario?.rol === Roles.ADMINISTRADOR;

    /** Antes del nombre se indica el tipo de usuario: "Paciente:" o "Profesional:". */
    readonly prefijoRol: string = this.usuario?.rol === Roles.MEDICO ? "Profesional:" : "Paciente:";

    readonly nombreCompleto: string = `${this.usuario?.nombres ?? ""} ${this.usuario?.apellidos ?? ""}`.trim();

    cerrarSesion(): void {
        this.authStore.cerrarSesion();
    }

}
