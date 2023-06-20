import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaSolicitacoesAlunoComponent } from './lista-solicitacoes-aluno.component';

describe('ListaSolicitacoesAlunoComponent', () => {
  let component: ListaSolicitacoesAlunoComponent;
  let fixture: ComponentFixture<ListaSolicitacoesAlunoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListaSolicitacoesAlunoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaSolicitacoesAlunoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
