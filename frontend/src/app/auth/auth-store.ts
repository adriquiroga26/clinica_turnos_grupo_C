import { inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Roles } from "../shared/roles";

export interface UsuarioToken {
    documento: string;
    sub: number;
    rol: Roles;
    nombres: string;
    apellidos: string;
    exp?: number;
}

@Injectable({
    providedIn: "root"
})
export class AuthStore {

    private readonly router: Router = inject(Router);

    guardarToken(token: string): void {
        sessionStorage.setItem("accessToken", token);
    }

    obtenerToken(): string | null {
        return sessionStorage.getItem("accessToken");
    }

    /**
     * Datos del usuario logueado, leídos del payload del JWT. Devuelve null si no hay sesión o el token venció.
     */
    obtenerUsuario(): UsuarioToken | null {

        const token = this.obtenerToken();

        if (!token) {
            return null;
        }

        try {
            const payload: string = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
            const usuario: UsuarioToken = JSON.parse(atob(payload));

            if (usuario.exp && usuario.exp * 1000 <= Date.now()) {
                return null;
            }

            return usuario;
        } catch {
            return null;
        }
    }

    obtenerRol(): Roles | null {
        return this.obtenerUsuario()?.rol ?? null;
    }

    estaAutenticado(): boolean {
        return this.obtenerUsuario() !== null;
    }

    cerrarSesion(): void {
        sessionStorage.removeItem("accessToken");
        this.router.navigateByUrl("/login");
    }

}
