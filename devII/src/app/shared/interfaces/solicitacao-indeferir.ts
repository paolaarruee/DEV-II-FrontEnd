export interface SolicitacaoIndeferir {
  id?: string;
  status?: string;
  etapa?: string;
  observacao: string;
  statusEtapaSetorEstagio?: string;
  statusEtapaCoordenador?: string;
  statusEtapaDiretor?: string;
}
