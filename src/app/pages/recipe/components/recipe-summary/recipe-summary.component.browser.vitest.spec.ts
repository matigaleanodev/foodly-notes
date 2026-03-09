import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { NavService } from '@shared/services/nav/nav.service';
import { RecipeSummaryComponent } from './recipe-summary.component';

describe('RecipeSummaryComponent (Vitest browser)', () => {
  let component: RecipeSummaryComponent;
  let fixture: ComponentFixture<RecipeSummaryComponent>;

  const navServiceMock = {
    forward: vi.fn(),
  };

  beforeEach(async () => {
    navServiceMock.forward.mockReset();

    await TestBed.configureTestingModule({
      imports: [RecipeSummaryComponent],
      providers: [{ provide: NavService, useValue: navServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(RecipeSummaryComponent);
    component = fixture.componentInstance;
  });

  it('rewrites external recipe links as internal routes', () => {
    fixture.componentRef.setInput(
      'summary',
      '<a href="https://spoonacular.com/recipes/test-123">link</a>',
    );
    fixture.detectChanges();

    expect(component.sanitizedSummary()).toContain('/recipe/123');
  });

  it('navigates through NavService when clicking an internal summary link', () => {
    fixture.componentRef.setInput(
      'summary',
      '<a href="https://spoonacular.com/recipes/test-999">link</a>',
    );
    fixture.detectChanges();

    const container: HTMLElement =
      fixture.nativeElement.querySelector('.recipe-summary');
    const anchor = container.querySelector('a') as HTMLAnchorElement;

    anchor.dispatchEvent(
      new MouseEvent('click', { bubbles: true, cancelable: true }),
    );

    expect(navServiceMock.forward).toHaveBeenCalledWith('/recipe/999');
  });
});
