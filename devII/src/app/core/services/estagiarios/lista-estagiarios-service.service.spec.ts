import { TestBed } from '@angular/core/testing';

import { ListaEstagiariosServiceService } from './lista-estagiarios-service.service';

describe('ListaEstagiariosServiceService', () => {
  let service: ListaEstagiariosServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ListaEstagiariosServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
