import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaixaConfimacaoComponent } from './caixa-confimacao.component';

describe('CaixaConfimacaoComponent', () => {
  let component: CaixaConfimacaoComponent;
  let fixture: ComponentFixture<CaixaConfimacaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaixaConfimacaoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaixaConfimacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
