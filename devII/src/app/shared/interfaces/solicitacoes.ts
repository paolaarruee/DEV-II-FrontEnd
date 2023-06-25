import { Servidor } from "./servidor";

export interface Solicitacoes {
  id: string;
  aluno: {
    id: null;
    nomeCompleto: string;
    usuarioSistema: {
      id: null;
      roles: {
        id: null;
        name: string;
      };
    };
    turno: string;
    matricula: string;
    ingresso: string;
  };
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

