import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadComponent: () =>
          import('@pages/home/home.page').then((m) => m.HomePage),
      },
      {
        path: 'favorites',
        loadComponent: () =>
          import('@pages/favorites/favorites.page').then(
            (m) => m.FavoritesPage,
          ),
      },
      {
        path: 'shopping-list',
        loadComponent: () =>
          import('@pages/shopping-list/shopping-list.page').then(
            (m) => m.ShoppingListPage,
          ),
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
    ],
  },
];
