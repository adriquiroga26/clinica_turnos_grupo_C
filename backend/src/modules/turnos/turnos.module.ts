import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Medico } from "./entities/medico.entity.js";
import { Reserva } from "./entities/reserva.entity.js";
import { MedicosController } from "./controllers/medicos.controller.js";
import { PacientesController } from "./controllers/pacientes.controller.js";
import { ReservasController } from "./controllers/reservas.controller.js";
import { MedicosService } from "./services/medicos.service.js";
import { PacientesService } from "./services/pacientes.service.js";
import { ReservasService } from "./services/reservas.service.js";
import { AuthModule } from "../auth/auth.module.js";

@Module({
    imports: [TypeOrmModule.forFeature([Medico, Reserva]), AuthModule],
    controllers: [MedicosController, PacientesController, ReservasController],
    providers: [MedicosService, PacientesService, ReservasService],
    exports: []
})
export class TurnosModule {

}
