import {
  Component,
  computed,
  inject,
  input,
  OnInit,
  SecurityContext,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NavService } from '@shared/services/nav/nav.service';

@Component({
  selector: 'app-recipe-summary',
  imports: [],
  templateUrl: './recipe-summary.component.html',
  styleUrls: ['./recipe-summary.component.scss'],
})
export class RecipeSummaryComponent {
  readonly summary = input.required<string>();

  private readonly _sanitizer = inject(DomSanitizer);
  private readonly _nav = inject(NavService);

  readonly sanitizedSummary = computed(() => {
    const summaryWithInternalLinks = this.replaceExternalLinks(this.summary());

    return (
      this._sanitizer.sanitize(
        SecurityContext.HTML,
        summaryWithInternalLinks,
      ) ?? ''
    );
  });

  private replaceExternalLinks(summary: string): string {
    const parser = new DOMParser();
    const doc = parser.parseFromString(summary, 'text/html');

    doc.querySelectorAll('a[href]').forEach((anchor) => {
      const href = anchor.getAttribute('href');
      if (!href) return;

      // Spoonacular URLs terminan siempre en "-<id>"
      const match = href.match(/-(\d+)$/);
      if (!match) return;

      const recipeId = match[1];

      anchor.setAttribute('href', `/recipe/${recipeId}`);
      anchor.setAttribute('data-internal', 'true');
    });

    return doc.body.innerHTML;
  }

  onSummaryClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const anchor = target.closest(
      'a[data-internal]',
    ) as HTMLAnchorElement | null;

    if (!anchor) return;

    const href = anchor.getAttribute('href');
    if (!href) return;

    event.preventDefault();
    this._nav.forward(href);
  }
}
