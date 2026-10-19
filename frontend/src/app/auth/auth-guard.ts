import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthStore } from "./auth-store";
import { Roles, rutaInicialPorRol } from "../shared/roles";

/**
 * Permite el acceso solo a usuarios con sesión iniciada (token válido y no vencido).
 */
export const authGuard: CanActivateFn = () => {

    const authStore: AuthStore = inject(AuthStore);

    if (authStore.estaAutenticado()) {
        return true;
    }

    return inject(Router).createUrlTree(["/login"]);
};

/**
 * Permite el acceso solo a los usuarios que tengan alguno de los roles indicados.
 * Si el rol no corresponde, se lo envía a su pantalla de inicio.
 */
export function rolGuard(...rolesPermitidos: Roles[]): CanActivateFn {

    return () => {

        const rol: Roles | null = inject(AuthStore).obtenerRol();

        if (rol && rolesPermitidos.includes(rol)) {
            return true;
        }

        return inject(Router).parseUrl(rutaInicialPorRol(rol));
    };
}
