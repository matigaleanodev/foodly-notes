import {
  Directive,
  ElementRef,
  HostListener,
  inject,
  input,
} from '@angular/core';
import { TranslateService } from '@shared/translate/translate.service';

@Directive({
  selector: '[appTooltip]',
  standalone: true,
})
export class TooltipDirective {
  private readonly _el = inject(ElementRef<HTMLElement>);
  private readonly _translate = inject(TranslateService);

  private tooltipEl?: HTMLElement;

  readonly tooltipKey = input.required<string>();

  @HostListener('mouseenter')
  @HostListener('touchstart')
  show() {
    if (this.tooltipEl) return;

    const text = this._translate.translate(this.tooltipKey());

    const tooltip = document.createElement('div');
    tooltip.className = 'app-tooltip';
    tooltip.textContent = text;

    document.body.appendChild(tooltip);

    const hostRect = this._el.nativeElement.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();

    let left = hostRect.left + hostRect.width / 2;
    const top = hostRect.top - 8;

    const padding = 8;

    if (left - tooltipRect.width / 2 < padding) {
      left = tooltipRect.width / 2 + padding;
    }

    if (left + tooltipRect.width / 2 > window.innerWidth - padding) {
      left = window.innerWidth - tooltipRect.width / 2 - padding;
    }

    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;

    this.tooltipEl = tooltip;
  }

  @HostListener('mouseleave')
  @HostListener('touchend')
  hide() {
    this.tooltipEl?.remove();
    this.tooltipEl = undefined;
  }
}
