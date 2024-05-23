import { Component } from '@angular/core';
import { CursosServiceService } from 'src/app/core/services/cursoService/cursos-service.service';
import { MatTableModule } from '@angular/material/table';
import { ToastService } from 'src/app/core/services/toast/toast.service';
import { ModalAnaliseComponent } from '../detalhes-solicitacao-estagio/modal-analise/modal-analise.component';
import { MatDialog } from '@angular/material/dialog';
import { AuthenticationService } from 'src/app/core/services/authentication/authentication.service';

@Component({
  selector: 'app-gerenciar-cursos',
  templateUrl: './gerenciar-cursos.component.html',
  styleUrls: ['./gerenciar-cursos.component.scss'],
  providers: [MatTableModule],
})
export class GerenciarCursosComponent {
  constructor(
    private cursosService: CursosServiceService,
    private toast: ToastService,
    private dialog: MatDialog,
    public authenticationService: AuthenticationService
  ) {}

  novoCurso = {
    nomeCurso: '',
    ativo: true,
  };

  cursos: any;
  displayedColumns: string[] = [
    'id',
    'nomeCurso',
    'ativo',
    'editar',
    'deletar',
  ];

  ngOnInit() {
    if (this.authenticationService.role === 1) {
      alert('Authenticação inválida!');
      alert('Você não tem permissão para acessar essa página');
      window.location.href = '/muralVagas';
      return;
    }

    this.listaCursos();
  }

  listaCursos() {
    this.cursosService.getTodosCursos().subscribe({
      next: (data) => {
        this.cursos = data;
      },
      error: (error) => {
        console.log('Erro ao listar cursos');
        if(error.status == 403){
          alert('Você não tem permissão para acessar essa página');
          window.location.href = '/muralVagas';
          }
      },
    });
  }

  trocarStatus(id: any) {
    this.cursosService.trocarStatus(id).subscribe({
      next: (data) => {
        this.listaCursos();
      },
      error: () => {
        console.log('Erro ao desativar curso');
      },
    });
  }

  adicionarCurso() {
    if (this.novoCurso.nomeCurso == '') {
      this.toast.showMessage(
        'Nome do curso não pode ser vazio',
        'Preencha o campo nome corretamente'
      );
      return;
    }
    if (this.novoCurso.nomeCurso.length < 3) {
      this.toast.showMessage(
        'Nome do curso deve ter no mínimo 3 caracteres (Sigla)',
        'Preencha o campo nome corretamente'
      );
      return;
    }

    const dialogRef = this.dialog.open(ModalAnaliseComponent, {
      width: '600px',
      data: {
        conteudo:
          'Tem certeza que deseja adicionar o curso de nome: <br><br><strong>( ' +
          this.novoCurso.nomeCurso +
          ' )</strong>?' +
          '<br><br>Após adicionar, o curso estará disponível para uso no sistema.',
        retroceder: false,
        enviarCallback: (motivoIndeferimento: string) => {
          this.cursosService.adicionarCurso(this.novoCurso).subscribe({
            next: (data) => {
              this.listaCursos();
              this.novoCurso = {
                nomeCurso: '',
                ativo: true,
              };
            },
            error: () => {
              this.toast.showMessage(
                'Erro ao adicionar curso',
                'Tente novamente'
              );
            },
          });
        },
      },
    });
  }

  deletarCurso(id: any) {
    const dialogRef = this.dialog.open(ModalAnaliseComponent, {
      width: '750px',
      data: {
        conteudo:
          'Após deletar, o curso não estará mais disponível para uso no sistema.<br>Essa ação é <strong>recomendada</strong> apenas para cadastros com nome errado.<br><br><strong>OBS:<br> #Todos os alunos vinculados a este curso serão desvinculados! <br> #Solicitações desse curso serão deletadas!<br>#A documentação das solicitações serão deletadas (Exceto drive) <br> #Conta do coordenador(a) do curso será excluida!</strong>',
        enviarCallback: () => {},
      },
    });
  }
}
