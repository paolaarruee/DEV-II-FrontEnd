import { Usuario, Curso} from './usuario';

export interface Servidor {
  id?: number;
  nome: string;
  cargo: string;
  curso: Curso;
  usuarioSistema: Usuario;
}
