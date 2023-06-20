import { Aluno } from './aluno';
import { Servidor } from './servidor';

export interface Solicitacoes {
  aluno: Aluno;
  servidor: Servidor;
  tipo: string;
  data: string;
  status: string | Status;
  titulo: string;
  conteudo: string;
  etapa: string;
  observacao: string;
  resposta: string;
}

export enum Status {
  DEFERIDO = 'DEFERIDO',
  INDEFERIDO = 'INDEFERIDO',
}
