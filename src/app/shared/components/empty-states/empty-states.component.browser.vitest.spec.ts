import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { TranslateService } from '@shared/translate/translate.service';
import { EmptyStatesComponent } from './empty-states.component';

describe('EmptyStatesComponent (Vitest browser)', () => {
  let component: EmptyStatesComponent;
  let fixture: ComponentFixture<EmptyStatesComponent>;

  const translateMock = {
    translate: vi.fn((key: string) => key),
  };

  beforeEach(async () => {
    translateMock.translate.mockClear();

    await TestBed.configureTestingModule({
      imports: [EmptyStatesComponent],
      providers: [{ provide: TranslateService, useValue: translateMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(EmptyStatesComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('imagen', 'favorito');
    fixture.componentRef.setInput('text', 'xSinFavoritos');
    fixture.detectChanges();
  });

  it('renders the expected image asset', () => {
    const img = fixture.nativeElement.querySelector('img') as HTMLImageElement;

    expect(component).toBeTruthy();
    expect(img.src).toContain('assets/empty-states/favorito.png');
  });

  it('renders the translated text', () => {
    const text = fixture.nativeElement.textContent;

    expect(translateMock.translate).toHaveBeenCalledWith('xSinFavoritos');
    expect(text).toContain('xSinFavoritos');
  });
});
