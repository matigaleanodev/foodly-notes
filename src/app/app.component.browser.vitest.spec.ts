import { TranslatePipe } from '@shared/translate/translate-pipe';
import { TranslateService } from '@shared/translate/translate.service';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterLink, RouterLinkActive, provideRouter } from '@angular/router';
import { IonApp, IonRouterOutlet, IonMenuButton } from '@ionic/angular';
import { beforeEach, describe, expect, it } from 'vitest';

import { AppComponent } from './app.component';

@Component({
  selector: 'app-menu',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Eager,
  template: '',
})
class MenuStubComponent {}

describe('AppComponent (Vitest)', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    TestBed.overrideComponent(AppComponent, {
      set: {
        imports: [IonApp, IonRouterOutlet, IonMenuButton, MenuStubComponent, RouterLink, RouterLinkActive, TranslatePipe],
      },
    });

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideRouter([]), { provide: TranslateService, useValue: { translate: (key: string) => key } }],
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
