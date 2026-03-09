import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ActionSheetController } from '@ionic/angular/standalone';
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';

import { ThemeService } from '@shared/services/theme/theme.service';
import { Language } from '@shared/translate/language.model';
import { TranslateService } from '@shared/translate/translate.service';
import { MenuComponent } from './menu.component';

describe('MenuComponent (Vitest browser)', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;
  let mainContentElement: HTMLDivElement;

  const sheetMock = {
    present: vi.fn().mockResolvedValue(undefined),
  };

  const actionSheetCtrlMock = {
    create: vi.fn().mockResolvedValue(sheetMock),
  };

  const themeMock = {
    currentTheme: signal<'system' | 'light' | 'dark'>('system'),
    setTheme: vi.fn(),
  };

  const translateMock = {
    currentLang: signal(Language.EN),
    translate: vi.fn((key: string) => key),
    setLanguage: vi.fn(),
  };

  beforeEach(async () => {
    sheetMock.present.mockClear();
    actionSheetCtrlMock.create.mockClear();
    themeMock.currentTheme.set('system');
    themeMock.setTheme.mockClear();
    translateMock.currentLang.set(Language.EN);
    translateMock.translate.mockClear();
    translateMock.setLanguage.mockClear();

    mainContentElement = document.createElement('div');
    mainContentElement.id = 'main-content';
    document.body.appendChild(mainContentElement);

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

  afterEach(() => {
    fixture.destroy();
    mainContentElement.remove();
  });

  it('renders with the live Ionic template', () => {
    expect(component).toBeTruthy();
    expect(fixture.nativeElement.querySelector('ion-menu')).not.toBeNull();
  });

  it('opens the language selector and dispatches the chosen language', async () => {
    await component.openLanguageSelector();

    expect(actionSheetCtrlMock.create).toHaveBeenCalled();
    expect(sheetMock.present).toHaveBeenCalled();

    const config = actionSheetCtrlMock.create.mock.calls.at(-1)?.[0];
    const spanishButton = config.buttons.find(
      (button: { text: string }) => button.text === 'Español',
    );

    spanishButton.handler();

    expect(translateMock.setLanguage).toHaveBeenCalledWith(Language.ES);
  });

  it('opens the theme selector and dispatches the chosen theme', async () => {
    await component.openThemeSelector();

    const config = actionSheetCtrlMock.create.mock.calls.at(-1)?.[0];
    const lightButton = config.buttons.find(
      (button: { text: string }) => button.text === 'xClaro',
    );

    lightButton.handler();

    expect(themeMock.setTheme).toHaveBeenCalledWith('light');
  });
});
