import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActionSheetController } from '@ionic/angular/standalone';
import { provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { MenuComponent } from './menu.component';
import { TranslateService } from '@shared/translate/translate.service';
import { ThemeService } from '@shared/services/theme/theme.service';
import { Language } from '@shared/translate/language.model';

describe('MenuComponent (Vitest)', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;

  const sheetMock = {
    present: vi.fn().mockResolvedValue(undefined),
  };

  const actionSheetCtrlMock = {
    create: vi.fn().mockResolvedValue(sheetMock),
  };

  const translateMock = {
    currentLang: signal(Language.EN),
    translate: vi.fn((key: string) => key),
    setLanguage: vi.fn(),
  };

  const themeMock = {
    currentTheme: signal<'system' | 'light' | 'dark'>('system'),
    setTheme: vi.fn(),
  };

  beforeEach(async () => {
    actionSheetCtrlMock.create.mockClear();
    sheetMock.present.mockClear();
    translateMock.setLanguage.mockClear();
    translateMock.translate.mockClear();
    themeMock.setTheme.mockClear();

    TestBed.overrideComponent(MenuComponent, {
      set: {
        template: '',
      },
    });

    await TestBed.configureTestingModule({
      imports: [MenuComponent],
      providers: [
        provideRouter([]),
        { provide: TranslateService, useValue: translateMock },
        { provide: ThemeService, useValue: themeMock },
        { provide: ActionSheetController, useValue: actionSheetCtrlMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates the component', () => {
    expect(component).toBeTruthy();
  });

  it('returns EN when the language is EN', () => {
    translateMock.currentLang.set(Language.EN);
    expect(component.currentLang()).toBe('EN');
  });

  it('returns ES when the language is ES', () => {
    translateMock.currentLang.set(Language.ES);
    expect(component.currentLang()).toBe('ES');
  });

  it('resolves the system theme label', () => {
    themeMock.currentTheme.set('system');
    expect(component.currentTheme()).toBe('xSistema');
  });

  it('resolves the light theme label', () => {
    themeMock.currentTheme.set('light');
    expect(component.currentTheme()).toBe('xClaro');
  });

  it('resolves the dark theme label', () => {
    themeMock.currentTheme.set('dark');
    expect(component.currentTheme()).toBe('xOscuro');
  });

  it('opens the language selector', async () => {
    await component.openLanguageSelector();

    expect(actionSheetCtrlMock.create).toHaveBeenCalled();
    expect(sheetMock.present).toHaveBeenCalled();
  });

  it('calls setLanguage when choosing Espanol', async () => {
    await component.openLanguageSelector();

    const config = actionSheetCtrlMock.create.mock.calls.at(-1)?.[0];
    const btn = config.buttons.find((b: { text: string }) => b.text === 'Español');

    btn.handler();
    expect(translateMock.setLanguage).toHaveBeenCalledWith(Language.ES);
  });

  it('calls setTheme when choosing Claro', async () => {
    await component.openThemeSelector();

    const config = actionSheetCtrlMock.create.mock.calls.at(-1)?.[0];
    const btn = config.buttons.find((b: { text: string }) => b.text === 'xClaro');

    btn.handler();
    expect(themeMock.setTheme).toHaveBeenCalledWith('light');
  });
});
