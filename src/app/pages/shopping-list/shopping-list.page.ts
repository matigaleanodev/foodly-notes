import { NavService } from '@shared/services/nav/nav.service';
import { Component, computed, DestroyRef, inject, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import {
  IonContent,
  IonButtons,
  IonBackButton,
  IonToolbar,
  IonHeader,
  IonMenuButton,
  IonCol,
  RefresherCustomEvent,
  IonRefresher,
  IonRefresherContent,
  IonRow,
} from '@ionic/angular';
import { ShoppingListService } from './services/shopping-list/shopping-list.service';
import { ShoppingRecipeCardComponent } from './components/shopping-recipe-card/shopping-recipe-card.component';
import { FavoritesService } from '@shared/services/favorites/favorites.service';
import { ShoppingRecipesService } from './services/shopping-recipe/shopping-recipe.service';
import { TranslatePipe } from '@shared/translate/translate-pipe';
import { EmptyStatesComponent } from '@shared/components/empty-states/empty-states.component';
import { TranslateService } from '@shared/translate/translate.service';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { EMPTY, catchError, skip, switchMap, tap } from 'rxjs';
import { ShoppingRecipe } from '@recipes/models/shopping-recipe.model';
import { RecipeService } from '@recipes/services/recipe/recipe.service';
import { ShoppingRecipeCardSkeletonComponent } from './components/shopping-recipe-card-skeleton/shopping-recipe-card-skeleton.component';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.page.html',
  styleUrls: ['./shopping-list.page.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    IonRow,
    IonRefresherContent,
    IonRefresher,
    IonCol,
    IonMenuButton,
    IonHeader,
    IonToolbar,
    IonBackButton,
    IonButtons,
    IonContent,
    ShoppingRecipeCardComponent,
    ShoppingRecipeCardSkeletonComponent,
    TranslatePipe,
    EmptyStatesComponent,
  ],
})
export class ShoppingListPage implements OnInit {
  private readonly _nav = inject(NavService);
  exploreRecipes() { this._nav.root('/home'); }

  private static readonly returnTo = '/shopping-list';

  private readonly _state = inject(ShoppingListService);
  private readonly _favorites = inject(FavoritesService);
  private readonly _shopping = inject(ShoppingRecipesService);
  private readonly _recipes = inject(RecipeService);
  private readonly _translate = inject(TranslateService);

  readonly currentLang = computed(() => this._translate.currentLang());

  readonly currentLang$ = toObservable(this.currentLang);
  private readonly destroyRef = inject(DestroyRef);

  readonly shoppingState = computed(() => this._state.shoppingState());
  readonly favoritos = computed(() => this._favorites.favorites());

  readonly shoppingRecipes = computed(() => this._shopping.recipes());

  readonly shoppingList = computed(() =>
    this.shoppingRecipes().map((recipe) => ({
      recipe,
      state: this.getShoppingState(recipe.sourceId),
    })),
  );
  readonly isLoading = signal(true);
  readonly errorStateKey = signal<string | null>(null);
  readonly skeletonCards = Array.from({ length: 3 });

  ngOnInit() {
    this.currentLang$
      .pipe(
        skip(1),
        takeUntilDestroyed(this.destroyRef),
        switchMap(() => this._shopping.refreshSync(true).pipe(
          tap(() => this.errorStateKey.set(null)),
          catchError(() => { this.errorStateKey.set('xErrorListaCompras'); return EMPTY; }),
        )),
      )
      .subscribe();
  }

  async ionViewWillEnter() {
    this.isLoading.set(true);

    try {
      await this._favorites.loadFavorites();
      await this._state.init();
      await this._shopping.sync();
      this.errorStateKey.set(null);
    } catch {
      this.errorStateKey.set('xErrorListaCompras');
    } finally {
      this.isLoading.set(false);
    }
  }

  onRefresh(event: RefresherCustomEvent) {
    this._favorites
      .loadFavorites()
      .then(() => this._state.init())
      .then(() => {
        this._shopping.refreshSync().subscribe({
          next: () => {
            this.errorStateKey.set(null);
            event.target.complete();
          },
          error: () => {
            this.errorStateKey.set('xErrorListaCompras');
            event.target.complete();
          },
        });
      })
      .catch(() => {
        event.target.complete();
      });
  }

  getShoppingState(recipeId: number) {
    return this.shoppingState().find((s) => s.recipeId === recipeId)!;
  }

  toRecipeDetail(recipe: ShoppingRecipe) {
    this._recipes.selectRecipe({ ...recipe, image: '' });

    this._recipes.toRecipeDetail(recipe.sourceId, {
      returnTo: ShoppingListPage.returnTo,
    });
  }
}
