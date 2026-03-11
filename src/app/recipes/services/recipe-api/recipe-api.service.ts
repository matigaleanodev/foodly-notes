import { Injectable, computed, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { from, map, Observable, of, switchMap } from 'rxjs';

import { DailyRecipe } from '@recipes/models/daily-recipe.model';
import { RecipeDetail } from '@recipes/models/recipe-detail.model';
import { SimilarRecipe } from '@recipes/models/similar-recipe.model';
import { ShoppingRecipe } from '@recipes/models/shopping-recipe.model';
import { environment } from '@env/environment';
import { SearchRecipe } from '@recipes/models/search-recipe.model';
import { TranslateService } from '@shared/translate/translate.service';
import { Language } from '@shared/translate/language.model';

interface RecipeSummaryResponse {
  sourceId: number;
  title: string;
  image?: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class RecipeApiService {
  private readonly http = inject(HttpClient);
  private readonly translate = inject(TranslateService);
  private readonly baseUrl = environment.API_URL;

  readonly lang = computed<'en' | 'es'>(() => {
    const currentLang = this.translate.currentLang();
    if (!currentLang) return 'en';

    return currentLang === Language.ES ? 'es' : 'en';
  });

  getDailyRecipes(): Observable<DailyRecipe[]> {
    return this.withReadyLanguage((lang) =>
      this.http
        .get<RecipeSummaryResponse[]>(`${this.baseUrl}/recipes/daily`, {
          params: {
            lang,
          },
        })
        .pipe(
          map((recipes) =>
            recipes.map((recipe) => this.normalizeSummary(recipe)),
          ),
        ),
    );
  }

  getRecipeDetail(sourceId: number): Observable<RecipeDetail> {
    return this.withReadyLanguage((lang) =>
      this.http.get<RecipeDetail>(`${this.baseUrl}/recipes/${sourceId}`, {
        params: {
          lang,
        },
      }),
    );
  }

  getSimilarRecipes(sourceId: number): Observable<SimilarRecipe[]> {
    return this.withReadyLanguage((lang) =>
      this.http
        .get<RecipeSummaryResponse[]>(
          `${this.baseUrl}/recipes/${sourceId}/similar`,
          {
            params: {
              lang,
            },
          },
        )
        .pipe(
          map((recipes) =>
            recipes.map((recipe) => this.normalizeSummary(recipe)),
          ),
        ),
    );
  }

  getIngredientsForRecipes(sourceIds: number[]): Observable<ShoppingRecipe[]> {
    return this.http.post<ShoppingRecipe[]>(
      `${this.baseUrl}/recipes/ingredients`,
      {
        sourceIds,
        lang: this.lang(),
      },
    );
  }

  getRecipesByQuery(query: string): Observable<SearchRecipe[]> {
    const q = query.trim();
    if (!q) {
      return of([]);
    }

    return this.withReadyLanguage((lang) => {
      const params = new HttpParams().set('q', q).set('lang', lang);

      return this.http
        .get<RecipeSummaryResponse[]>(`${this.baseUrl}/recipes/search`, {
          params,
        })
        .pipe(
          map((recipes) =>
            recipes.map((recipe) => this.normalizeSummary(recipe)),
          ),
        );
    });
  }

  private normalizeSummary(recipe: RecipeSummaryResponse): DailyRecipe {
    return {
      sourceId: recipe.sourceId,
      title: recipe.title,
      image: recipe.image ?? '',
    };
  }

  private withReadyLanguage<T>(
    requestFactory: (lang: 'en' | 'es') => Observable<T>,
  ): Observable<T> {
    return from(this.translate.whenReady()).pipe(
      switchMap(() => requestFactory(this.lang())),
    );
  }
}
