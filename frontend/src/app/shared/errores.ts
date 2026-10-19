import { HttpErrorResponse } from "@angular/common/http";

/**
 * Extrae el mensaje de error que devuelve la API (NestJS) para mostrarlo al usuario.
 * Si no hay mensaje, se usa el que se indique por defecto.
 */
export function mensajeDeError(error: unknown, porDefecto: string): string {

    if (error instanceof HttpErrorResponse) {

        const mensaje: unknown = error.error?.message;

        if (Array.isArray(mensaje)) {
            return mensaje.join(". ");
        }

        if (typeof mensaje === "string" && mensaje.length > 0) {
            return mensaje;
        }
    }

    return porDefecto;

}
