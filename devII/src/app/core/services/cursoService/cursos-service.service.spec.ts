import { TestBed } from '@angular/core/testing';

import { CursosServiceService } from './cursos-service.service';

describe('CursosServiceService', () => {
  let service: CursosServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CursosServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
