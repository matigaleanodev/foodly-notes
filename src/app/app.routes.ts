import { Routes } from '@angular/router';
import { recipeDetailResolver } from '@recipes/resolver/recipe-detail-resolver';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'recipe/:id',
    loadComponent: () =>
      import('@pages/recipe/recipe.page').then((m) => m.RecipePage),
    resolve: {
      data: recipeDetailResolver,
    },
  },
  {
    path: 'similar/:id',
    loadComponent: () =>
      import('@pages/similar/similar.page').then((m) => m.SimilarPage),
  },
  {
    path: 'shopping-list',
    loadComponent: () =>
      import('./pages/shopping-list/shopping-list.page').then(
        (m) => m.ShoppingListPage,
      ),
  },
  {
    path: 'info',
    loadComponent: () =>
      import('./pages/info/info.page').then((m) => m.InfoPage),
  },
  {
    path: 'search',
    loadComponent: () =>
      import('./pages/search/search.page').then((m) => m.SearchPage),
  },
  {
    path: 'terms',
    loadComponent: () =>
      import('./pages/legal/terms/terms.page').then((m) => m.TermsPage),
  },
  {
    path: 'privacy',
    loadComponent: () =>
      import('./pages/legal/privacy/privacy.page').then((m) => m.PrivacyPage),
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];
