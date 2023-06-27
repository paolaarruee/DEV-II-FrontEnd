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
  servidor: {
    id: null;
    nome: string;
    cargo: string;
    usuarioSistema: {
      id: null;
      roles: {
        id: null;
        name: string;
      };
    };

  };
  tipo: string;
  data_solicitacao: string ;
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
  EM_ANDAMENTO ='EM_ANDAMENTO'
}

