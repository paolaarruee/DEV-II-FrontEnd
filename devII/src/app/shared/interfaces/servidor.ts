import { Usuario } from './usuario';

export interface Servidor {
  nome: string;
  cargo: string;
  curso: string;
  usuarioSistema: Usuario;
}
