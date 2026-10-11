import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { TranslateService } from '@shared/translate/translate.service';
import { HomeHeroComponent } from './home-hero.component';

describe('HomeHeroComponent (Vitest browser)', () => {
  let component: HomeHeroComponent;
  let fixture: ComponentFixture<HomeHeroComponent>;

  const translateMock = {
    translate: vi.fn((key: string) => key),
  };

  beforeEach(async () => {
    translateMock.translate.mockClear();

    await TestBed.configureTestingModule({
      imports: [HomeHeroComponent],
      providers: [{ provide: TranslateService, useValue: translateMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeHeroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('updates the query while typing', () => {
    const event = {
      target: {
        value: 'Pizza',
      },
    } as unknown as Event;

    component.handleInput(event);

    expect(component.query()).toBe('Pizza');
  });

  it('does not emit an empty search', () => {
    const emitSpy = vi.spyOn(component.searchSubmit, 'emit');

    component.query.set('   ');
    component.onEnter();

    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('emits a search and preserves the query when the input is valid', () => {
    const emitSpy = vi.spyOn(component.searchSubmit, 'emit');

    component.query.set('pizza');
    component.onEnter();

    expect(emitSpy).toHaveBeenCalledWith('pizza');
    expect(component.query()).toBe('pizza');
  });
  it('accepts short searches and restores the query from the route', () => {
    const emit = vi.spyOn(component.searchSubmit, 'emit');
    fixture.componentRef.setInput('initialQuery', 'té');
    fixture.detectChanges();
    component.onEnter();
    expect(emit).toHaveBeenCalledWith('té');
    expect(component.query()).toBe('té');
    expect(fixture.nativeElement.querySelector('input').labels.length).toBe(1);
  });

});
