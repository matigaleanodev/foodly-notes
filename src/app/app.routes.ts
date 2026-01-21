import { Routes } from '@angular/router';
import { recipeResolver } from '@shared/resolver/recipe-resolver';

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
      recipe: recipeResolver,
    },
  },
  {
    path: 'similar/:id',
    loadComponent: () =>
      import('@pages/similar/similar.page').then((m) => m.SimilarPage),
    resolve: {
      recipe: recipeResolver,
    },
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];
