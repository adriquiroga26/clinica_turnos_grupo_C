import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CrearReserva, Reserva } from "./modelos";

@Injectable({
    providedIn: "root"
})
export class ReservasApiClient {

    private readonly httpClient: HttpClient = inject(HttpClient);

    /**
     * Pacientes: sus propias reservas. Administradores: todas las reservas.
     * Médicos: sus reservas de la fecha indicada (YYYY-MM-DD).
     */
    listarReservas(fecha?: string): Observable<Reserva[]> {

        let params: HttpParams = new HttpParams();

        if (fecha) {
            params = params.set("fecha", fecha);
        }

        return this.httpClient.get<Reserva[]>("/api/v1/reservas", { params });

    }

    crearReserva(reserva: CrearReserva): Observable<{ id: number }> {

        return this.httpClient.post<{ id: number }>("/api/v1/reservas", reserva);

    }

    cancelarReserva(id: number): Observable<void> {

        return this.httpClient.put<void>(`/api/v1/reservas/${id}/cancelar`, {});

    }

    marcarAtendido(id: number): Observable<void> {

        return this.httpClient.put<void>(`/api/v1/reservas/${id}/atendido`, {});

    }

    marcarAusente(id: number): Observable<void> {

        return this.httpClient.put<void>(`/api/v1/reservas/${id}/ausente`, {});

    }

}
