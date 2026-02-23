import { routes } from './app.routes';

describe('app routes', () => {
  it('debería dejar search sin resolver para permitir skeleton durante la carga', () => {
    const searchRoute = routes.find((route) => route.path === 'search');

    expect(searchRoute).toBeDefined();
    expect(searchRoute?.resolve).toBeUndefined();
  });

  it('debería dejar similar sin resolver para permitir skeleton durante la carga', () => {
    const similarRoute = routes.find((route) => route.path === 'similar/:id');

    expect(similarRoute).toBeDefined();
    expect(similarRoute?.resolve).toBeUndefined();
  });
});
