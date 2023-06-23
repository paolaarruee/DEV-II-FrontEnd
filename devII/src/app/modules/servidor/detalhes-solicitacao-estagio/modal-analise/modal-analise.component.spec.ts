import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAnaliseComponent } from './modal-analise.component';

describe('ModalAnaliseComponent', () => {
  let component: ModalAnaliseComponent;
  let fixture: ComponentFixture<ModalAnaliseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalAnaliseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalAnaliseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
