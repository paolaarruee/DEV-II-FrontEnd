import { TestBed } from '@angular/core/testing';

import { FormularioServidorService } from './formulario-servidor.service';

describe('FormularioServidorService', () => {
  let service: FormularioServidorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormularioServidorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
