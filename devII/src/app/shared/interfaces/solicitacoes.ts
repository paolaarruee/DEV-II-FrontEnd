export interface Solicitacoes {
  id: string;
  aluno: {
    id: string;
    nomeCompleto: string;
    usuarioSistema: {
      id: string;
      email: string;
      senha: string;
      roles: {
        id: string;
        name: string;
      };
    };
    turno: string;
    matricula: string;
    role: {
      id: string;
      name: string;
    };
    curso: {
      id: string;
      nomeCurso: string;
    };
    ativo: string;
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
  dataSolicitacao: string;
  editavel: string;
  status: string;
  titulo: string;
  conteudo: string;
  etapa: string;
  observacao: string;
  resposta: string;
  statusEtapaCoordenador: string;
  statusSetorEstagio: string;
  statusEtapaDiretor: string;
  historico: [];
}
export interface Historico {
  id: string;
  data_solicitacao: string;
  etapa: string;
  status: string;
}

export enum Status {
  DEFERIDO = 'Deferido',
  INDEFERIDO = 'Indeferido',
  EM_ANDAMENTO = 'Em análise',
}
