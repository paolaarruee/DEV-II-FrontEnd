import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AtualizarDocsComponent } from './atualizar-docs.component';

describe('AtualizarDocsComponent', () => {
  let component: AtualizarDocsComponent;
  let fixture: ComponentFixture<AtualizarDocsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AtualizarDocsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AtualizarDocsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
