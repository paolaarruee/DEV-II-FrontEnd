import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnviarDocumentosSolicitacaoComponent } from './enviar-documentos-solicitacao.component';

describe('EnviarDocumentosSolicitacaoComponent', () => {
  let component: EnviarDocumentosSolicitacaoComponent;
  let fixture: ComponentFixture<EnviarDocumentosSolicitacaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnviarDocumentosSolicitacaoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnviarDocumentosSolicitacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
