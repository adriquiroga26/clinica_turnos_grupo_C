import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { catchError, Observable, throwError } from "rxjs";
import { MessageService } from "primeng/api";
import { AuthStore } from "./auth-store";

export function authInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {

  const authStore: AuthStore = inject(AuthStore);
  const messageService: MessageService = inject(MessageService);

  const authToken = authStore.obtenerToken();

  if (!authToken) {
    return next(req);
  }

  const reqWithToken = req.clone({
    headers: req.headers.set('Authorization', `Bearer ${authToken}`)
  });

  return next(reqWithToken).pipe(
    catchError((error: unknown) => {

      // Si el token venció o es inválido, se cierra la sesión y se vuelve al login
      if (error instanceof HttpErrorResponse && error.status === 401) {
        authStore.cerrarSesion();
        messageService.add({ severity: "warn", summary: "La sesión expiró. Vuelva a iniciar sesión" });
      }

      return throwError(() => error);
    })
  );
}
