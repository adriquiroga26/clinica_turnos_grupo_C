import { Component, computed, inject, model, output, signal } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { CurrencyPipe } from "@angular/common";
import { NgSelectComponent } from "@ng-select/ng-select";
import { MessageService } from "primeng/api";
import { Button } from "primeng/button";
import { DatePicker } from "primeng/datepicker";
import { Dialog } from "primeng/dialog";
import { Select } from "primeng/select";
import { AuthStore } from "../../auth/auth-store";
import { Roles } from "../../shared/roles";
import { mensajeDeError } from "../../shared/errores";
import { armarFechaHora, DIAS_MAXIMOS_ANTICIPACION, HORA_APERTURA, HORA_CIERRE } from "../../shared/fechas";
import { CrearReserva, Medico, Paciente } from "../modelos";
import { MedicosApiClient } from "../medicos-api-client";
import { PacientesApiClient } from "../pacientes-api-client";
import { ReservasApiClient } from "../reservas-api-client";

interface OpcionMedico extends Medico {
    etiqueta: string;
}

interface OpcionPaciente extends Paciente {
    etiqueta: string;
}

interface OpcionHora {
    etiqueta: string;
    valor: number;
}

@Component({
    selector: "app-reserva-nueva",
    templateUrl: "./reserva-nueva.html",
    styleUrl: "./reserva-nueva.css",
    imports: [ReactiveFormsModule, CurrencyPipe, NgSelectComponent, Dialog, DatePicker, Select, Button]
})
export class ReservaNueva {

    private readonly messageService: MessageService = inject(MessageService);

    private readonly authStore: AuthStore = inject(AuthStore);

    private readonly medicosApiClient: MedicosApiClient = inject(MedicosApiClient);

    private readonly pacientesApiClient: PacientesApiClient = inject(PacientesApiClient);

    private readonly reservasApiClient: ReservasApiClient = inject(ReservasApiClient);

    /** Controla si el diálogo se muestra (se enlaza con [(visible)] desde el componente padre). */
    visible = model<boolean>(false);

    /** Se emite cuando la reserva se creó correctamente, para que el padre recargue el listado. */
    reservaCreada = output<void>();

    readonly esAdministrador: boolean = this.authStore.obtenerRol() === Roles.ADMINISTRADOR;

    medicos = signal<OpcionMedico[]>([]);

    pacientes = signal<OpcionPaciente[]>([]);

    guardando = signal<boolean>(false);

    /** Id del médico elegido, usado para mostrar el valor de la consulta vigente. */
    private readonly idMedicoElegido = signal<number | null>(null);

    readonly medicoElegido = computed(() => this.medicos().find((m) => m.id === this.idMedicoElegido()) ?? null);

    readonly fechaMinima: Date = new Date();

    readonly fechaMaxima: Date = this.calcularFechaMaxima();

    form: FormGroup = new FormGroup({
        idMedico: new FormControl<number | null>(null, Validators.required),
        idPaciente: new FormControl<number | null>(null, this.esAdministrador ? Validators.required : null),
        fecha: new FormControl<Date | null>(null, Validators.required),
        hora: new FormControl<number | null>(null, Validators.required)
    });

    /**
     * Se ejecuta cada vez que se abre el diálogo: limpia el formulario y carga las opciones a elegir.
     */
    alMostrar(): void {

        this.form.reset();
        this.idMedicoElegido.set(null);

        this.medicosApiClient.listarMedicos().subscribe({
            next: (medicos) => this.medicos.set(medicos.map((m) => ({
                ...m,
                etiqueta: `${m.apellidos}, ${m.nombres} (Mat. ${m.matricula})`
            }))),
            error: (error) => this.messageService.add({ severity: "error", summary: mensajeDeError(error, "No se pudo obtener el listado de médicos") })
        });

        if (this.esAdministrador) {
            this.pacientesApiClient.listarPacientes().subscribe({
                next: (pacientes) => this.pacientes.set(pacientes.map((p) => ({
                    ...p,
                    etiqueta: `${p.apellidos}, ${p.nombres} (Doc. ${p.documento})`
                }))),
                error: (error) => this.messageService.add({ severity: "error", summary: mensajeDeError(error, "No se pudo obtener el listado de pacientes") })
            });
        }
    }

    alElegirMedico(medico: OpcionMedico | undefined): void {
        this.idMedicoElegido.set(medico?.id ?? null);
    }

    /**
     * Horarios en los que se puede comenzar un turno. Si la fecha elegida es hoy, no se ofrecen horas que ya pasaron.
     */
    obtenerHoras(): OpcionHora[] {

        const fecha: Date | null = this.form.value.fecha;
        const horas: OpcionHora[] = [];
        const ahora: Date = new Date();
        const esHoy: boolean = fecha !== null && fecha.toDateString() === ahora.toDateString();

        for (let hora = HORA_APERTURA; hora < HORA_CIERRE; hora++) {

            if (esHoy && hora <= ahora.getHours()) {
                continue;
            }

            horas.push({ etiqueta: `${hora.toString().padStart(2, "0")}:00 hs`, valor: hora });
        }

        return horas;
    }

    reservar(): void {

        if (!this.form.valid) {
            this.form.markAllAsTouched();
            this.messageService.add({ severity: "error", summary: "Es necesario completar todos los campos del formulario para avanzar" });
            return;
        }

        const reserva: CrearReserva = {
            idMedico: this.form.value.idMedico,
            fechaHora: armarFechaHora(this.form.value.fecha, this.form.value.hora)
        };

        if (this.esAdministrador) {
            reserva.idPaciente = this.form.value.idPaciente;
        }

        this.guardando.set(true);

        this.reservasApiClient.crearReserva(reserva).subscribe({
            next: () => {
                this.guardando.set(false);
                this.messageService.add({ severity: "success", summary: "Turno reservado correctamente" });
                this.visible.set(false);
                this.reservaCreada.emit();
            },
            error: (error) => {
                this.guardando.set(false);
                this.messageService.add({ severity: "error", summary: mensajeDeError(error, "Ha ocurrido un error al reservar el turno") });
            }
        });

    }

    private calcularFechaMaxima(): Date {

        const fecha: Date = new Date();
        fecha.setDate(fecha.getDate() + DIAS_MAXIMOS_ANTICIPACION);

        return fecha;
    }

}
