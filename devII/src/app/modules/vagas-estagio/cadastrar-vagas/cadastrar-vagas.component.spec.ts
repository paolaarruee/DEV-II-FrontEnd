import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastrarVagasComponent } from './cadastrar-vagas.component';

describe('CadastrarVagasComponent', () => {
  let component: CadastrarVagasComponent;
  let fixture: ComponentFixture<CadastrarVagasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CadastrarVagasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadastrarVagasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
