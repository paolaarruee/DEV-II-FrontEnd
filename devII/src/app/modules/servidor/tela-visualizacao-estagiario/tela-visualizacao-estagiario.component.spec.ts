import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TelaVisualizacaoEstagiarioComponent } from './tela-visualizacao-estagiario.component';

describe('TelaVisualizacaoEstagiarioComponent', () => {
  let component: TelaVisualizacaoEstagiarioComponent;
  let fixture: ComponentFixture<TelaVisualizacaoEstagiarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TelaVisualizacaoEstagiarioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TelaVisualizacaoEstagiarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
