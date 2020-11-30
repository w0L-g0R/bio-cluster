import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RadialTreePanelComponent } from './radial-tree-panel.component';

describe('RadialTreePanelComponent', () => {
  let component: RadialTreePanelComponent;
  let fixture: ComponentFixture<RadialTreePanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RadialTreePanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RadialTreePanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
