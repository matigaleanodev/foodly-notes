import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeHeroComponent } from './home-hero.component';
import { TranslateService } from '@shared/translate/translate.service';

describe('HomeHeroComponent', () => {
  let component: HomeHeroComponent;
  let fixture: ComponentFixture<HomeHeroComponent>;

  const translateMock = {
    translate: jasmine
      .createSpy('translate')
      .and.callFake((key: string) => key),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeHeroComponent],
      providers: [{ provide: TranslateService, useValue: translateMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeHeroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debería actualizar el query al escribir', () => {
    const event = {
      target: {
        value: 'Pizza',
      },
    } as unknown as Event;

    component.handleInput(event);

    expect(component.query()).toBe('pizza');
  });

  it('no debería emitir búsqueda si el texto es menor a 3 caracteres', () => {
    spyOn(component.onSearch, 'emit');

    component.query.set('pi');
    component.onEnter();

    expect(component.onSearch.emit).not.toHaveBeenCalled();
  });

  it('debería emitir búsqueda si el texto es válido', () => {
    spyOn(component.onSearch, 'emit');

    component.query.set('pizza');
    component.onEnter();

    expect(component.onSearch.emit).toHaveBeenCalledWith('pizza');
  });
});
