import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalhesSolicitacaoServidorComponent } from './detalhes-solicitacao.component';

describe('DetalhesSolicitacaoServidorComponent', () => {
  let component: DetalhesSolicitacaoServidorComponent;
  let fixture: ComponentFixture<DetalhesSolicitacaoServidorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetalhesSolicitacaoServidorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalhesSolicitacaoServidorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
