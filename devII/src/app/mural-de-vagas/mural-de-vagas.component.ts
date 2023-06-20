import { Component } from '@angular/core';
import { DadosBackendService } from './dados-backend.service';

@Component({
  selector: 'app-mural-de-vagas',
  templateUrl: './mural-de-vagas.component.html',
  styleUrls: ['./mural-de-vagas.component.scss']
})
export class MuralDeVagasComponent {

  listaVagas: any[] = [];

  constructor(private service: DadosBackendService) {}

  ngOnInit() {
    this.service.obterSolicitacoes().subscribe(
      solicitacoes => {
        console.log("Está chegando");
        console.log(solicitacoes);
        console.log(this.listaVagas);
        this.listaVagas = solicitacoes;
        console.log(this.listaVagas);

        // Ordena a lista de solicitações com base na data de criação em ordem decrescente
        this.listaVagas.sort((a, b) => {
          const dataA = new Date(a.dataSolicitacao).getTime();
          const dataB = new Date(b.dataSolicitacao).getTime();
          return dataB - dataA;
        });

      },
      error => {
        console.error('Erro ao obter as solicitações:', error);
      }
    );
  }

  // listaVagas = [
  //   {
  //     titulo: 'Estagio vaga xxxxx',
  //     empresa:'EMPRESA DE SERVIÇOS ADVOCATÍCIOS ',
  //     agencia: 'AGIEL - AGÊNCIA VIRTUAL DE ESTÁGIOSGABRIELA FERREIRA - EQUIPE AGIEL',
  //     descricao: 'Residir em Porto Alegre e curse Ensino Médio, Marketing, Técnico Em Vendas, Técnico Em Administração, Gestão de Marketing e Vendas e Gestão de Marketing.Atividades - Responder clientes por WhatsApp e telefone; - Oferecer o serviço jurídico; - Agendar consulta jurídica com o cliente, pedir avaliação do atendimento; - Editar fotos e documentos; - Digitalizar documentos de clientes. Pré requisitos',
  //     local: 'Porto Alegre',
  //     valor: 'a combinar (R$ 550,00)',
  //     turno:'Tarde'
  //   },
  //   {
  //     titulo: 'Estagio vaga xxxxx',
  //     empresa:'EMPRESA DE SERVIÇOS ADVOCATÍCIOS ',
  //     agencia: 'AGIEL - AGÊNCIA VIRTUAL DE ESTÁGIOSGABRIELA FERREIRA - EQUIPE AGIEL',
  //     descricao: 'Residir em Porto Alegre e curse Ensino Médio, Marketing, Técnico Em Vendas, Técnico Em Administração, Gestão de Marketing e Vendas e Gestão de Marketing.Atividades - Responder clientes por WhatsApp e telefone; - Oferecer o serviço jurídico; - Agendar consulta jurídica com o cliente, pedir avaliação do atendimento; - Editar fotos e documentos; - Digitalizar documentos de clientes. Pré requisitos',
  //     local: 'Porto Alegre',
  //     valor: 'a combinar (R$ 550,00)',
  //     turno:'Tarde'
  //   },
  //   {
  //     titulo: 'Estagio vaga xxxxx',
  //     empresa:'EMPRESA DE SERVIÇOS ADVOCATÍCIOS ',
  //     agencia: 'AGIEL - AGÊNCIA VIRTUAL DE ESTÁGIOSGABRIELA FERREIRA - EQUIPE AGIEL',
  //     descricao: 'Residir em Porto Alegre e curse Ensino Médio, Marketing, Técnico Em Vendas, Técnico Em Administração, Gestão de Marketing e Vendas e Gestão de Marketing.Atividades - Responder clientes por WhatsApp e telefone; - Oferecer o serviço jurídico; - Agendar consulta jurídica com o cliente, pedir avaliação do atendimento; - Editar fotos e documentos; - Digitalizar documentos de clientes. Pré requisitos',
  //     local: 'Porto Alegre',
  //     valor: 'a combinar (R$ 550,00)',
  //     turno:'Tarde'
  //   },
  //   {
  //     titulo: 'Estagio vaga xxxxx',
  //     empresa:'EMPRESA DE SERVIÇOS ADVOCATÍCIOS ',
  //     agencia: 'AGIEL - AGÊNCIA VIRTUAL DE ESTÁGIOSGABRIELA FERREIRA - EQUIPE AGIEL',
  //     descricao: 'Residir em Porto Alegre e curse Ensino Médio, Marketing, Técnico Em Vendas, Técnico Em Administração, Gestão de Marketing e Vendas e Gestão de Marketing.Atividades - Responder clientes por WhatsApp e telefone; - Oferecer o serviço jurídico; - Agendar consulta jurídica com o cliente, pedir avaliação do atendimento; - Editar fotos e documentos; - Digitalizar documentos de clientes. Pré requisitos',
  //     local: 'Porto Alegre',
  //     valor: 'a combinar (R$ 550,00)',
  //     turno:'Tarde'
  //   },
  //   {
  //     titulo: 'Estagio vaga xxxxx',
  //     empresa:'EMPRESA DE SERVIÇOS ADVOCATÍCIOS ',
  //     agencia: 'AGIEL - AGÊNCIA VIRTUAL DE ESTÁGIOSGABRIELA FERREIRA - EQUIPE AGIEL',
  //     descricao: 'Residir em Porto Alegre e curse Ensino Médio, Marketing, Técnico Em Vendas, Técnico Em Administração, Gestão de Marketing e Vendas e Gestão de Marketing.Atividades - Responder clientes por WhatsApp e telefone; - Oferecer o serviço jurídico; - Agendar consulta jurídica com o cliente, pedir avaliação do atendimento; - Editar fotos e documentos; - Digitalizar documentos de clientes. Pré requisitos',
  //     local: 'Porto Alegre',
  //     valor: 'a combinar (R$ 550,00)',
  //     turno:'Tarde'
  //   },
  // ]

}
