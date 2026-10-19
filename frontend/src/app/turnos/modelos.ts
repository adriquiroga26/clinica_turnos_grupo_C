export type EstadoReserva = "ACTIVO" | "ATENDIDO" | "AUSENTE" | "CANCELADO";

export interface Medico {
    id: number;
    nombres: string;
    apellidos: string;
    matricula: number;
    valorConsulta: number;
}

export interface Paciente {
    id: number;
    nombres: string;
    apellidos: string;
    documento: string;
}

export interface Reserva {
    id: number;
    fechaHora: string;
    estado: EstadoReserva;
    valorConsulta: number;
    medico: Omit<Medico, "valorConsulta">;
    paciente: Paciente;
}

export interface CrearReserva {
    idMedico: number;
    fechaHora: string;
    idPaciente?: number;
}

/**
 * Color del tag con el que se muestra cada estado de una reserva.
 */
export function severidadDeEstado(estado: EstadoReserva): "info" | "success" | "warn" | "danger" {

    switch (estado) {
        case "ACTIVO":
            return "info";
        case "ATENDIDO":
            return "success";
        case "AUSENTE":
            return "warn";
        default:
            return "danger";
    }

}
