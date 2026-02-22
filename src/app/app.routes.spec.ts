import { routes } from './app.routes';
import { searchResolver } from '@recipes/resolver/search-resolver';

describe('app routes', () => {
  it('debería configurar search para re-ejecutar resolver con cambios de query params', () => {
    const searchRoute = routes.find((route) => route.path === 'search');

    expect(searchRoute).toBeDefined();
    expect(searchRoute?.resolve).toEqual({
      data: searchResolver,
    });
    expect(searchRoute?.runGuardsAndResolvers).toBe(
      'paramsOrQueryParamsChange',
    );
  });
});
