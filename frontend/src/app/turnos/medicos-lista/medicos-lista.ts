import { Component, inject, OnInit, signal } from "@angular/core";
import { CurrencyPipe } from "@angular/common";
import { FormControl, ReactiveFormsModule, Validators } from "@angular/forms";
import { MessageService } from "primeng/api";
import { Button } from "primeng/button";
import { Dialog } from "primeng/dialog";
import { InputNumber } from "primeng/inputnumber";
import { TableModule } from "primeng/table";
import { mensajeDeError } from "../../shared/errores";
import { Medico } from "../modelos";
import { MedicosApiClient } from "../medicos-api-client";

@Component({
    selector: "app-medicos-lista",
    templateUrl: "./medicos-lista.html",
    styleUrl: "./medicos-lista.css",
    imports: [CurrencyPipe, ReactiveFormsModule, TableModule, Button, Dialog, InputNumber]
})
export class MedicosLista implements OnInit {

    private readonly messageService: MessageService = inject(MessageService);

    private readonly medicosApiClient: MedicosApiClient = inject(MedicosApiClient);

    medicos = signal<Medico[]>([]);

    cargando = signal<boolean>(false);

    guardando = signal<boolean>(false);

    dialogoVisible = signal<boolean>(false);

    medicoSeleccionado = signal<Medico | null>(null);

    valorConsulta: FormControl<number | null> = new FormControl<number | null>(null, [Validators.required, Validators.min(0)]);

    ngOnInit(): void {
        this.cargarMedicos();
    }

    cargarMedicos(): void {

        this.cargando.set(true);

        this.medicosApiClient.listarMedicos().subscribe({
            next: (medicos) => {
                this.medicos.set(medicos);
                this.cargando.set(false);
            },
            error: (error) => {
                this.cargando.set(false);
                this.messageService.add({ severity: "error", summary: mensajeDeError(error, "No se pudo obtener el listado de médicos") });
            }
        });
    }

    abrirDialogo(medico: Medico): void {

        this.medicoSeleccionado.set(medico);
        this.valorConsulta.setValue(medico.valorConsulta);
        this.dialogoVisible.set(true);
    }

    guardarValorConsulta(): void {

        const medico: Medico | null = this.medicoSeleccionado();

        if (!medico || !this.valorConsulta.valid || this.valorConsulta.value === null) {
            this.valorConsulta.markAsTouched();
            this.messageService.add({ severity: "error", summary: "Se debe indicar un valor de consulta válido (mayor o igual a cero)" });
            return;
        }

        this.guardando.set(true);

        this.medicosApiClient.actualizarValorConsulta(medico.id, this.valorConsulta.value).subscribe({
            next: () => {
                this.guardando.set(false);
                this.dialogoVisible.set(false);
                this.messageService.add({ severity: "success", summary: "Valor de la consulta actualizado correctamente" });
                this.cargarMedicos();
            },
            error: (error) => {
                this.guardando.set(false);
                this.messageService.add({ severity: "error", summary: mensajeDeError(error, "No se pudo actualizar el valor de la consulta") });
            }
        });
    }

}
