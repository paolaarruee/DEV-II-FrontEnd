import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalhesSolicitacaoComponent } from './detalhes-solicitacao.component';

describe('DetalhesSolicitacaoComponent', () => {
  let component: DetalhesSolicitacaoComponent;
  let fixture: ComponentFixture<DetalhesSolicitacaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetalhesSolicitacaoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalhesSolicitacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
