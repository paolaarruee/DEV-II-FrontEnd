import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalhesVagaComponent } from './detalhes-vaga.component';

describe('DetalhesVagaComponent', () => {
  let component: DetalhesVagaComponent;
  let fixture: ComponentFixture<DetalhesVagaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetalhesVagaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalhesVagaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
