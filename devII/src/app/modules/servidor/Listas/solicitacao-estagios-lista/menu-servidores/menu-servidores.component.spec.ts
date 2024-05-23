import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuServidoresComponent } from './menu-servidores.component';

describe('MenuServidoresComponent', () => {
  let component: MenuServidoresComponent;
  let fixture: ComponentFixture<MenuServidoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MenuServidoresComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuServidoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
