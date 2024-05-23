import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitacaoEstagiosListaComponent } from './solicitacao-estagios-lista.component';

describe('SolicitacaoEstagiosListaComponent', () => {
  let component: SolicitacaoEstagiosListaComponent;
  let fixture: ComponentFixture<SolicitacaoEstagiosListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SolicitacaoEstagiosListaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolicitacaoEstagiosListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
