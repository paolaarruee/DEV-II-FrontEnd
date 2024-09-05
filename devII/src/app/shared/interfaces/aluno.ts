import { Usuario } from './usuario';

export interface Aluno {
  id: string;
  nomeCompleto: string;
  usuarioSistema: Usuario;
  turno: string;
  matricula: string;
  curso: string;
}
