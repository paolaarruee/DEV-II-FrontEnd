import { TestBed } from '@angular/core/testing';

import { AnaliseDocumentosService } from './analise-documentos.service';

describe('AnaliseDocumentosService', () => {
  let service: AnaliseDocumentosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnaliseDocumentosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
