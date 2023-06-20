import { TestBed } from '@angular/core/testing';

import { DadosBackendService } from './dados-backend.service';

describe('DadosBackendService', () => {
  let service: DadosBackendService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DadosBackendService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
