import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaSolicitacoesServidorComponent } from './lista-solicitacoes-servidor.component';

describe('ListaSolicitacoesServidorComponent', () => {
  let component: ListaSolicitacoesServidorComponent;
  let fixture: ComponentFixture<ListaSolicitacoesServidorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListaSolicitacoesServidorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaSolicitacoesServidorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
