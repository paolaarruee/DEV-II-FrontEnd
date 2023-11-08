import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaServidorComponent } from './lista-servidor.component';

describe('ListaServidorComponent', () => {
  let component: ListaServidorComponent;
  let fixture: ComponentFixture<ListaServidorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListaServidorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaServidorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
