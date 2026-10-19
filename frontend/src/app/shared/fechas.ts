/** Horas de comienzo de los turnos: se atiende de 8hs a 16hs y cada turno dura una hora (último turno: 15hs). */
export const HORA_APERTURA = 8;
export const HORA_CIERRE = 16;

/** Cantidad máxima de días de anticipación con los que se puede reservar. */
export const DIAS_MAXIMOS_ANTICIPACION = 30;

function dosDigitos(numero: number): string {
    return numero.toString().padStart(2, "0");
}

/**
 * Formatea una fecha como YYYY-MM-DD (usando la fecha local, no la UTC).
 */
export function formatearFecha(fecha: Date): string {
    return `${fecha.getFullYear()}-${dosDigitos(fecha.getMonth() + 1)}-${dosDigitos(fecha.getDate())}`;
}

/**
 * Devuelve la misma fecha a las 00:00hs (para comparar días calendario, sin tener en cuenta la hora).
 */
export function inicioDelDia(fecha: Date): Date {
    return new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate());
}

/**
 * Arma la fecha y hora de un turno (YYYY-MM-DDTHH:00:00, sin zona horaria: es la hora de la clínica).
 */
export function armarFechaHora(fecha: Date, hora: number): string {
    return `${formatearFecha(fecha)}T${dosDigitos(hora)}:00:00`;
}
