import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaqEditDialogComponent } from './faq-edit-dialog.component';

describe('FaqEditDialogComponent', () => {
  let component: FaqEditDialogComponent;
  let fixture: ComponentFixture<FaqEditDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FaqEditDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FaqEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
