import { Routes } from '@angular/router';
import { recipeDetailResolver } from '@recipes/resolver/recipe-detail-resolver';
import { similarRecipesResolver } from '@recipes/resolver/similar-recipes-resolver';

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
      recipe: recipeDetailResolver,
    },
  },
  {
    path: 'similar/:id',
    loadComponent: () =>
      import('@pages/similar/similar.page').then((m) => m.SimilarPage),
    resolve: {
      recipe: similarRecipesResolver,
    },
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
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];
