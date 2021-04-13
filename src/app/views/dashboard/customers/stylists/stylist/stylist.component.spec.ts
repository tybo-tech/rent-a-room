/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { StylistComponent } from './stylist.component';

describe('StylistComponent', () => {
  let component: StylistComponent;
  let fixture: ComponentFixture<StylistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StylistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StylistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
