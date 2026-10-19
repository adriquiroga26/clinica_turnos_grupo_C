import { Component, computed, inject, OnInit, signal } from "@angular/core";
import { CurrencyPipe, DatePipe } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ConfirmationService, MessageService } from "primeng/api";
import { Button } from "primeng/button";
import { ConfirmDialog } from "primeng/confirmdialog";
import { IconField } from "primeng/iconfield";
import { InputIcon } from "primeng/inputicon";
import { InputText } from "primeng/inputtext";
import { Select } from "primeng/select";
import { TableModule } from "primeng/table";
import { Tag } from "primeng/tag";
import { AuthStore } from "../../auth/auth-store";
import { Roles } from "../../shared/roles";
import { mensajeDeError } from "../../shared/errores";
import { inicioDelDia } from "../../shared/fechas";
import { EstadoReserva, Reserva, severidadDeEstado } from "../modelos";
import { ReservasApiClient } from "../reservas-api-client";
import { ReservaNueva } from "../reserva-nueva/reserva-nueva";

@Component({
    selector: "app-reservas-lista",
    templateUrl: "./reservas-lista.html",
    styleUrl: "./reservas-lista.css",
    imports: [DatePipe, CurrencyPipe, FormsModule, TableModule, Button, Tag, Select, InputText, IconField, InputIcon,
        ConfirmDialog, ReservaNueva],
    providers: [ConfirmationService]
})
export class ReservasLista implements OnInit {

    private readonly messageService: MessageService = inject(MessageService);

    private readonly confirmationService: ConfirmationService = inject(ConfirmationService);

    private readonly authStore: AuthStore = inject(AuthStore);

    private readonly reservasApiClient: ReservasApiClient = inject(ReservasApiClient);

    /** Los administradores ven todos los turnos; los pacientes solo los propios. */
    readonly esAdministrador: boolean = this.authStore.obtenerRol() === Roles.ADMINISTRADOR;

    readonly estados: EstadoReserva[] = ["ACTIVO", "ATENDIDO", "AUSENTE", "CANCELADO"];

    readonly severidadDeEstado = severidadDeEstado;

    reservas = signal<Reserva[]>([]);

    cargando = signal<boolean>(false);

    dialogoNuevaReservaVisible = signal<boolean>(false);

    estadoFiltro = signal<EstadoReserva | null>(null);

    textoBusqueda = signal<string>("");

    reservasFiltradas = computed<Reserva[]>(() => {

        const estado = this.estadoFiltro();
        const texto = this.textoBusqueda().trim().toLowerCase();

        return this.reservas().filter((r) => {

            if (estado && r.estado !== estado) {
                return false;
            }

            if (!texto) {
                return true;
            }

            const contenido: string = [
                r.medico.apellidos, r.medico.nombres,
                r.paciente.apellidos, r.paciente.nombres, r.paciente.documento
            ].join(" ").toLowerCase();

            return contenido.includes(texto);
        });
    });

    ngOnInit(): void {
        this.cargarReservas();
    }

    cargarReservas(): void {

        this.cargando.set(true);

        this.reservasApiClient.listarReservas().subscribe({
            next: (reservas) => {
                this.reservas.set(reservas);
                this.cargando.set(false);
            },
            error: (error) => {
                this.cargando.set(false);
                this.messageService.add({ severity: "error", summary: mensajeDeError(error, "No se pudo obtener el listado de turnos") });
            }
        });
    }

    abrirNuevaReserva(): void {
        this.dialogoNuevaReservaVisible.set(true);
    }

    /**
     * Un paciente puede cancelar hasta el día anterior a la consulta.
     * Un administrador puede cancelar hasta el momento en que inicia la consulta.
     */
    puedeCancelar(reserva: Reserva): boolean {

        if (reserva.estado !== "ACTIVO") {
            return false;
        }

        const fechaHora: Date = new Date(reserva.fechaHora);

        if (this.esAdministrador) {
            return Date.now() < fechaHora.getTime();
        }

        return inicioDelDia(new Date()).getTime() < inicioDelDia(fechaHora).getTime();
    }

    confirmarCancelacion(reserva: Reserva): void {

        this.confirmationService.confirm({
            header: "Cancelar turno",
            message: `¿Está seguro de que desea cancelar el turno con ${reserva.medico.apellidos}, ${reserva.medico.nombres}?`,
            icon: "pi pi-exclamation-triangle",
            acceptButtonProps: { label: "Sí, cancelar", severity: "danger" },
            rejectButtonProps: { label: "No", severity: "secondary", outlined: true },
            accept: () => this.cancelarReserva(reserva)
        });
    }

    private cancelarReserva(reserva: Reserva): void {

        this.reservasApiClient.cancelarReserva(reserva.id).subscribe({
            next: () => {
                this.messageService.add({ severity: "success", summary: "Turno cancelado correctamente" });
                this.cargarReservas();
            },
            error: (error) => {
                this.messageService.add({ severity: "error", summary: mensajeDeError(error, "No se pudo cancelar el turno") });
            }
        });
    }

}
