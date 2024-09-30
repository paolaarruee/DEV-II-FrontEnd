import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualDoAlunoComponent } from './manual-do-aluno.component';

describe('ManualDoAlunoComponent', () => {
  let component: ManualDoAlunoComponent;
  let fixture: ComponentFixture<ManualDoAlunoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManualDoAlunoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManualDoAlunoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
