import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnaliseDocsComponent } from './analise-docs.component';

describe('AnaliseDocsComponent', () => {
  let component: AnaliseDocsComponent;
  let fixture: ComponentFixture<AnaliseDocsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnaliseDocsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnaliseDocsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
