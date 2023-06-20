import { TestBed } from '@angular/core/testing';

import { CadastrarVagasService } from './cadastrar-vagas.service';

describe('CadastrarVagasService', () => {
  let service: CadastrarVagasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CadastrarVagasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
