import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioServidorComponent } from './formulario-servidor.component';

describe('FormularioServidorComponent', () => {
  let component: FormularioServidorComponent;
  let fixture: ComponentFixture<FormularioServidorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormularioServidorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormularioServidorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});


