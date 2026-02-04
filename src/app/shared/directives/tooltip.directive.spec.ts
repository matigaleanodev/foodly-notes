import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { TooltipDirective } from './tooltip.directive';
import { TranslateService } from '@shared/translate/translate.service';

@Component({
  standalone: true,
  template: ` <button appTooltip [tooltipKey]="'xTooltipTest'">Test</button> `,
  imports: [TooltipDirective],
})
class TestHostComponent {}

describe('TooltipDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;

  const translateMock = {
    translate: jasmine
      .createSpy('translate')
      .and.returnValue('Texto traducido'),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [{ provide: TranslateService, useValue: translateMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    document.querySelector('.app-tooltip')?.remove();
  });

  it('debería crear el tooltip al hacer mouseenter', () => {
    const button = fixture.debugElement.query(By.css('button'));

    button.triggerEventHandler('mouseenter', {});
    fixture.detectChanges();

    const tooltip = document.querySelector('.app-tooltip') as HTMLElement;

    expect(translateMock.translate).toHaveBeenCalledWith('xTooltipTest');
    expect(tooltip).toBeTruthy();
    expect(tooltip.textContent).toBe('Texto traducido');
  });

  it('debería eliminar el tooltip al hacer mouseleave', () => {
    const button = fixture.debugElement.query(By.css('button'));

    button.triggerEventHandler('mouseenter', {});
    fixture.detectChanges();

    button.triggerEventHandler('mouseleave', {});
    fixture.detectChanges();

    const tooltip = document.querySelector('.app-tooltip');

    expect(tooltip).toBeNull();
  });
});
