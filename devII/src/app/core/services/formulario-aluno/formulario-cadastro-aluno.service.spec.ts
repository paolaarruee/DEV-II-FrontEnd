import { TestBed } from '@angular/core/testing';

import { FormularioCadastroAlunoService } from './formulario-cadastro-aluno.service';

describe('FormularioCadastroAlunoService', () => {
  let service: FormularioCadastroAlunoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormularioCadastroAlunoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
