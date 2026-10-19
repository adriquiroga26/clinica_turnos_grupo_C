import { Controller, Get, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse } from "@nestjs/swagger";
import { PacientesService } from "../services/pacientes.service.js";
import { PacienteResumenDTO } from "../dtos/output/paciente-resumen.dto.js";
import { AuthGuard } from "../../auth/guards/auth.guard.js";
import { RolesGuard } from "../../auth/guards/roles.guard.js";
import { Roles } from "../../auth/decorators/roles.decorator.js";
import { RolesUsuariosEnum } from "../../auth/enums/roles-usuarios.enum.js";

@Controller('pacientes')
export class PacientesController {

    constructor(private readonly service: PacientesService) { }

    @ApiBearerAuth()
    @ApiOkResponse({ type: PacienteResumenDTO, isArray: true })
    @Roles(RolesUsuariosEnum.ADMINISTRADOR)
    @UseGuards(AuthGuard, RolesGuard)
    @Get()
    async listarPacientes(): Promise<PacienteResumenDTO[]> {

        return await this.service.listarPacientesActivos();
    }

}
