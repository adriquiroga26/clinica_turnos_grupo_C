export enum Roles {
    MEDICO = "MEDICO",
    PACIENTE = "PACIENTE",
    ADMINISTRADOR = "ADMINISTRADOR"
}

/**
 * Devuelve la ruta a la que se debe enviar a un usuario al iniciar sesión, según su rol.
 */
export function rutaInicialPorRol(rol: Roles | null): string {

    switch (rol) {
        case Roles.PACIENTE:
            return "/mis-turnos";
        case Roles.MEDICO:
            return "/agenda";
        case Roles.ADMINISTRADOR:
            return "/reservas";
        default:
            return "/login";
    }

}
