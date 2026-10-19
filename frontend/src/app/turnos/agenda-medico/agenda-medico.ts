import { Component, inject, OnInit, signal } from "@angular/core";
import { CurrencyPipe, DatePipe } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Observable } from "rxjs";
import { ConfirmationService, MessageService } from "primeng/api";
import { Button } from "primeng/button";
import { ConfirmDialog } from "primeng/confirmdialog";
import { DatePicker } from "primeng/datepicker";
import { TableModule } from "primeng/table";
import { Tag } from "primeng/tag";
import { mensajeDeError } from "../../shared/errores";
import { formatearFecha } from "../../shared/fechas";
import { Reserva, severidadDeEstado } from "../modelos";
import { ReservasApiClient } from "../reservas-api-client";

@Component({
    selector: "app-agenda-medico",
    templateUrl: "./agenda-medico.html",
    styleUrl: "./agenda-medico.css",
    imports: [DatePipe, CurrencyPipe, FormsModule, TableModule, Button, Tag, DatePicker, ConfirmDialog],
    providers: [ConfirmationService]
})
export class AgendaMedico implements OnInit {

    private readonly messageService: MessageService = inject(MessageService);

    private readonly confirmationService: ConfirmationService = inject(ConfirmationService);

    private readonly reservasApiClient: ReservasApiClient = inject(ReservasApiClient);

    readonly severidadDeEstado = severidadDeEstado;

    fecha = signal<Date>(new Date());

    reservas = signal<Reserva[]>([]);

    cargando = signal<boolean>(false);

    ngOnInit(): void {
        this.cargarReservas();
    }

    cambiarFecha(fecha: Date | null): void {

        // Si el usuario limpia el campo se mantiene la fecha que ya estaba seleccionada
        if (!fecha) {
            return;
        }

        this.fecha.set(fecha);
        this.cargarReservas();
    }

    hoy(): Date {
        return new Date();
    }

    moverFecha(dias: number): void {

        const fecha: Date = new Date(this.fecha());
        fecha.setDate(fecha.getDate() + dias);

        this.cambiarFecha(fecha);
    }

    cargarReservas(): void {

        this.cargando.set(true);

        this.reservasApiClient.listarReservas(formatearFecha(this.fecha())).subscribe({
            next: (reservas) => {
                this.reservas.set(reservas);
                this.cargando.set(false);
            },
            error: (error) => {
                this.cargando.set(false);
                this.messageService.add({ severity: "error", summary: mensajeDeError(error, "No se pudo obtener la agenda") });
            }
        });
    }

    confirmarAtendido(reserva: Reserva): void {

        this.confirmarCambioDeEstado(
            reserva,
            "Marcar como atendido",
            "atendido",
            () => this.reservasApiClient.marcarAtendido(reserva.id)
        );
    }

    confirmarAusente(reserva: Reserva): void {

        this.confirmarCambioDeEstado(
            reserva,
            "Marcar como ausente",
            "ausente",
            () => this.reservasApiClient.marcarAusente(reserva.id)
        );
    }

    private confirmarCambioDeEstado(reserva: Reserva, titulo: string, estado: string, accion: () => Observable<void>): void {

        this.confirmationService.confirm({
            header: titulo,
            message: `¿Desea marcar el turno de ${reserva.paciente.apellidos}, ${reserva.paciente.nombres} como ${estado}? Esta acción no se puede deshacer.`,
            icon: "pi pi-question-circle",
            acceptLabel: "Sí",
            rejectButtonProps: { label: "No", severity: "secondary", outlined: true },
            accept: () => {
                accion().subscribe({
                    next: () => {
                        this.messageService.add({ severity: "success", summary: `Turno marcado como ${estado}` });
                        this.cargarReservas();
                    },
                    error: (error) => {
                        this.messageService.add({ severity: "error", summary: mensajeDeError(error, "No se pudo actualizar el turno") });
                    }
                });
            }
        });
    }

}
