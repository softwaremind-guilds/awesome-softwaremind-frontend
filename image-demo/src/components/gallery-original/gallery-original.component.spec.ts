import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GalleryOriginalComponent } from './gallery-original.component';

describe('GalleryOriginalComponent', () => {
  let component: GalleryOriginalComponent;
  let fixture: ComponentFixture<GalleryOriginalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GalleryOriginalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GalleryOriginalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
