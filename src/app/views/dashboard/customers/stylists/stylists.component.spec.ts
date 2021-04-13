/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { StylistsComponent } from './stylists.component';

describe('StylistsComponent', () => {
  let component: StylistsComponent;
  let fixture: ComponentFixture<StylistsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StylistsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StylistsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
