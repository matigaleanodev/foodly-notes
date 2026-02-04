import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { ActionSheetController } from '@ionic/angular/standalone';
import { provideRouter } from '@angular/router';
import { MenuComponent } from './menu.component';
import { TranslateService } from '@shared/translate/translate.service';
import { ThemeService } from '@shared/services/theme/theme.service';
import { Language } from '@shared/translate/language.model';
import { TranslatePipeStub } from '@shared/mocks/translate-pipe.mock';
import { translateMock } from '@shared/mocks/translate-service.mock';

describe('MenuComponent', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;

  const sheetMock = {
    present: jasmine.createSpy('present').and.resolveTo(),
  };

  const actionSheetCtrlMock = {
    create: jasmine.createSpy('create').and.resolveTo(sheetMock),
  };

  const themeMock = {
    currentTheme: signal<'system' | 'light' | 'dark'>('system'),
    setTheme: jasmine.createSpy('setTheme'),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuComponent, TranslatePipeStub],
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

  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debería devolver EN cuando el idioma es EN', () => {
    translateMock.currentLang.set(Language.EN);
    expect(component.currentLang()).toBe('EN');
  });

  it('debería devolver ES cuando el idioma es ES', () => {
    translateMock.currentLang.set(Language.ES);
    expect(component.currentLang()).toBe('ES');
  });

  it('debería resolver el tema system', () => {
    themeMock.currentTheme.set('system');
    expect(component.currentTheme()).toBe('xSistema');
  });

  it('debería resolver el tema light', () => {
    themeMock.currentTheme.set('light');
    expect(component.currentTheme()).toBe('xClaro');
  });

  it('debería resolver el tema dark', () => {
    themeMock.currentTheme.set('dark');
    expect(component.currentTheme()).toBe('xOscuro');
  });

  it('debería abrir el selector de idioma', async () => {
    await component.openLanguageSelector();

    expect(actionSheetCtrlMock.create).toHaveBeenCalled();
    expect(sheetMock.present).toHaveBeenCalled();
  });

  it('debería llamar setLanguage al elegir Español', async () => {
    await component.openLanguageSelector();

    const config = actionSheetCtrlMock.create.calls.mostRecent().args[0];
    const btn = config.buttons.find((b: any) => b.text === 'Español');

    btn.handler();
    expect(translateMock.setLanguage).toHaveBeenCalledWith(Language.ES);
  });

  it('debería llamar setTheme al elegir Claro', async () => {
    await component.openThemeSelector();

    const config = actionSheetCtrlMock.create.calls.mostRecent().args[0];
    const btn = config.buttons.find((b: any) => b.text === 'xClaro');

    btn.handler();
    expect(themeMock.setTheme).toHaveBeenCalledWith('light');
  });
});
