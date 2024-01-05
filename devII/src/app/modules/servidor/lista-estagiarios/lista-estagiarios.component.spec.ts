import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaEstagiariosComponent } from './lista-estagiarios.component';

describe('ListaEstagiariosComponent', () => {
  let component: ListaEstagiariosComponent;
  let fixture: ComponentFixture<ListaEstagiariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListaEstagiariosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaEstagiariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
