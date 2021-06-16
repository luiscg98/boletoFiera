import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectorC2Component } from './sector-c2.component';

describe('SectorC2Component', () => {
  let component: SectorC2Component;
  let fixture: ComponentFixture<SectorC2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SectorC2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SectorC2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
