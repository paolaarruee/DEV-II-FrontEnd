import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MuralDeVagasComponent } from './mural-de-vagas.component';

describe('MuralDeVagasComponent', () => {
  let component: MuralDeVagasComponent;
  let fixture: ComponentFixture<MuralDeVagasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MuralDeVagasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MuralDeVagasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
