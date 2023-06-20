import { Aluno } from './aluno';
import { Servidor } from './servidor';

export interface Solicitacoes {
  aluno: Aluno;
  servidor: Servidor;
  tipo: string;
  data: string;
  status: string;
  titulo: string;
  conteudo: string;
  etapa: string;
  observacao: string;
  resposta: string;
}
