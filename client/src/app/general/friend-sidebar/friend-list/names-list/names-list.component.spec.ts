import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NamesListComponent } from './names-list.component';

describe('NamesListComponent', () => {
  let component: NamesListComponent;
  let fixture: ComponentFixture<NamesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NamesListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NamesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
