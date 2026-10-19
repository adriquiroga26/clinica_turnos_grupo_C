import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Paciente } from "./modelos";

@Injectable({
    providedIn: "root"
})
export class PacientesApiClient {

    private readonly httpClient: HttpClient = inject(HttpClient);

    listarPacientes(): Observable<Paciente[]> {

        return this.httpClient.get<Paciente[]>("/api/v1/pacientes");

    }

}
