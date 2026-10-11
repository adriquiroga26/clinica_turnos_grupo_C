import { Component, inject } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MessageService } from "primeng/api";
import { LoginApiClient } from "./login-api-client";
import { AuthStore } from "../auth-store";
import { Button } from "primeng/button";
import { Password } from "primeng/password";
import { InputText } from "primeng/inputtext";

@Component({
    selector: "app-login",
    templateUrl: "./login.html",
    styleUrl: "./login.css",
    imports: [ReactiveFormsModule, InputText, Password, Button]
})
export class Login {

    private readonly messageService: MessageService = inject(MessageService);

    private readonly loginApiClient: LoginApiClient = inject(LoginApiClient);

    private readonly authStore: AuthStore = inject(AuthStore);

    form: FormGroup = new FormGroup({
        documento: new FormControl(null, Validators.required),
        clave: new FormControl(null, Validators.required)
    });

    iniciarSesion() {

        if (!this.form.valid) {
            this.messageService.add({ severity: "error", summary: "Es necesario completar todos los campos del formulario para avanzar" });
            return;
        }

        const documento: string = this.form.value.documento;

        const clave: string = this.form.value.clave;

        this.loginApiClient.iniciarSesion(documento, clave).subscribe({
            next: (res) => {
                this.authStore.guardarToken(res.accessToken);
                // TODO: navegar a la pantalla principal cuando exista (según el rol del usuario)
                this.messageService.add({ severity: "success", summary: "Sesión iniciada correctamente" });
            },
            error: () => {
                this.messageService.add({ severity: "error", summary: "Ha ocurrido un error al iniciar sesión. Verifique las credenciales ingresadas" });
            }
        });

    }

}
