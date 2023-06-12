import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitacaoServidorComponent } from './solicitacao.component';

describe('SolicitacaoServidorComponent', () => {
  let component: SolicitacaoServidorComponent;
  let fixture: ComponentFixture<SolicitacaoServidorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SolicitacaoServidorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolicitacaoServidorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
