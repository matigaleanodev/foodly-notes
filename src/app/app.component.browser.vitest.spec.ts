import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { beforeEach, describe, expect, it } from 'vitest';

import { AppComponent } from './app.component';

@Component({
  selector: 'app-menu',
  standalone: true,
  template: '',
})
class MenuStubComponent {}

describe('AppComponent (Vitest)', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    TestBed.overrideComponent(AppComponent, {
      set: {
        imports: [IonApp, IonRouterOutlet, MenuStubComponent],
      },
    });

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates the root component', () => {
    expect(component).toBeTruthy();
  });

  it('renders the main router outlet with the expected id', () => {
    const outlet = fixture.nativeElement.querySelector('ion-router-outlet');

    expect(outlet).not.toBeNull();
    expect(outlet.getAttribute('id')).toBe('main-content');
  });

  it('renders the application menu', () => {
    const menu = fixture.nativeElement.querySelector('app-menu');

    expect(menu).not.toBeNull();
  });
});
