import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TelaSolicitacaoComponent } from './tela-solicitacao.component';

describe('TelaSolicitacaoComponent', () => {
  let component: TelaSolicitacaoComponent;
  let fixture: ComponentFixture<TelaSolicitacaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TelaSolicitacaoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TelaSolicitacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
