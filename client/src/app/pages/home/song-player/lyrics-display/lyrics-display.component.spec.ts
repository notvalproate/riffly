import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LyricsDisplayComponent } from './lyrics-display.component';

describe('LyricsDisplayComponent', () => {
  let component: LyricsDisplayComponent;
  let fixture: ComponentFixture<LyricsDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LyricsDisplayComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LyricsDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
