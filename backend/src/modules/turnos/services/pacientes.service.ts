import { Injectable } from "@nestjs/common";
import { UsuariosService } from "../../auth/services/usuarios.service.js";
import { RolesUsuariosEnum } from "../../auth/enums/roles-usuarios.enum.js";
import { PacienteResumenDTO } from "../dtos/output/paciente-resumen.dto.js";

@Injectable()
export class PacientesService {

    constructor(private readonly usuariosService: UsuariosService) { }

    async listarPacientesActivos(): Promise<PacienteResumenDTO[]> {

        const pacientes = await this.usuariosService.listarUsuariosActivosPorRol(RolesUsuariosEnum.PACIENTE);

        return pacientes.map((p) => {
            const dto = new PacienteResumenDTO();
            dto.id = p.id;
            dto.nombres = p.nombres;
            dto.apellidos = p.apellidos;
            dto.documento = p.documento;
            return dto;
        });
    }

}
