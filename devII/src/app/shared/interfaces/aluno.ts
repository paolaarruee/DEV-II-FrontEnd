import { Usuario } from './usuario';

export interface Aluno {
  nomeCompleto: string;
  usuarioSistema: Usuario;
  turno: string;
  matricula: string;
  curso: string;
}
