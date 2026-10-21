# Sistema de Turnos - Clínica Médica

Materia: Desarrollo de Aplicaciones Web (UNER) - 2026

Trabajo Final Integrador

Grupo C

Integrantes: Myriam Canosa, Yamila Lorenzo, Leonel Piter, Adriana Quiroga y Cintia Ríos

Video de presentación: (completar con el enlace)


## Descripción

Sistema web para gestionar los turnos de una clínica médica, con tres roles:

- Paciente: reserva turnos, lista los suyos y los cancela hasta el día anterior a la consulta.
- Médico: ve sus turnos de una fecha y los marca como atendido o ausente.
- Administrador: reserva a nombre de un paciente, lista los turnos, los cancela hasta el momento en que inicia la consulta y modifica el valor de la consulta de los médicos.

## Configuración

Base de datos: `database/script.sql` crea las tablas y los usuarios de prueba (la base se llama `clinica_turnos`; la conexión se configura en `backend/.env`).

nginx y PM2: la configuración está en `nginx/nginx.conf` y `backend/ecosystem.config.cjs`, y se muestran funcionando en el video.

## Usuarios de prueba

- Administrador - Documento: 00000001 Clave: admin123
- Médico - Documento: 20111222 Clave: medico123
- Paciente - Documento: 30222333 Clave: paciente123
- Paciente dado de baja (no puede ingresar) - Documento: 36444555 Clave: paciente123

El script carga además otros 4 médicos y 9 pacientes (claves `medico123` y `paciente123`).

## Documentación

- **Swagger** (API): `http://localhost:3000/api`, con el backend levantado.
- **Compodoc** (código): abrir `backend/documentation/index.html` y `frontend/documentation/index.html` en el navegador.
