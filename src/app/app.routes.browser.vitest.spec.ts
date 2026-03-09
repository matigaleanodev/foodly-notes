import { describe, expect, it } from 'vitest';

import { routes } from './app.routes';

describe('app routes (Vitest)', () => {
  it('keeps search without resolver so the page can show a loading skeleton', () => {
    const searchRoute = routes.find((route) => route.path === 'search');

    expect(searchRoute).toBeDefined();
    expect(searchRoute?.resolve).toBeUndefined();
  });

  it('keeps similar without resolver so the page can show a loading skeleton', () => {
    const similarRoute = routes.find((route) => route.path === 'similar/:id');

    expect(similarRoute).toBeDefined();
    expect(similarRoute?.resolve).toBeUndefined();
  });
});
