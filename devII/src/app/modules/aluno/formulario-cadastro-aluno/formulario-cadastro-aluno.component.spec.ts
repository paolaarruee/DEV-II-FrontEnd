import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioCadastroAlunoComponent } from './formulario-cadastro-aluno.component';

describe('FormularioCadastroAlunoComponent', () => {
  let component: FormularioCadastroAlunoComponent;
  let fixture: ComponentFixture<FormularioCadastroAlunoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormularioCadastroAlunoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormularioCadastroAlunoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
