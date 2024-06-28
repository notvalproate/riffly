import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SongListDisplayComponent } from './song-list-display.component';

describe('SongListDisplayComponent', () => {
  let component: SongListDisplayComponent;
  let fixture: ComponentFixture<SongListDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SongListDisplayComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SongListDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
