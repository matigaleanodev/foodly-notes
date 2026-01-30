import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { TranslateService } from '@shared/services/translate/translate.service';

import { DailyRecipe } from '@recipes/models/daily-recipe.model';
import { RecipeDetail } from '@recipes/models/recipe-detail.model';
import { SimilarRecipe } from '@recipes/models/similar-recipe.model';
import { ShoppingRecipe } from '@recipes/models/shopping-recipe.model';
import { environment } from '@env/environment';
import { SearchRecipe } from '@recipes/models/search-recipe.model';

@Injectable({
  providedIn: 'root',
})
export class RecipeApiService {
  private readonly http = inject(HttpClient);
  private readonly translate = inject(TranslateService);
  private readonly baseUrl = environment.API_URL;

  getDailyRecipes(): Observable<DailyRecipe[]> {
    return this.http.get<DailyRecipe[]>(`${this.baseUrl}/recipes/daily`, {
      params: {
        lang: this.translate.lang(),
      },
    });
  }

  getRecipeDetail(sourceId: number): Observable<RecipeDetail> {
    return this.http.get<RecipeDetail>(`${this.baseUrl}/recipes/${sourceId}`, {
      params: {
        lang: this.translate.lang(),
      },
    });
  }

  getSimilarRecipes(sourceId: number): Observable<SimilarRecipe[]> {
    return this.http.get<SimilarRecipe[]>(
      `${this.baseUrl}/recipes/${sourceId}/similar`,
    );
  }

  getIngredientsForRecipes(sourceIds: number[]): Observable<ShoppingRecipe[]> {
    return this.http.post<ShoppingRecipe[]>(
      `${this.baseUrl}/recipes/ingredients`,
      {
        sourceIds,
        lang: this.translate.lang(),
      },
    );
  }

  getRecipesByQuery(query: string): Observable<SearchRecipe[]> {
    const q = query.trim();
    if (!q) {
      return of([]);
    }

    const params = new HttpParams().set('q', q);

    return this.http.get<SearchRecipe[]>(`${this.baseUrl}/recipes/search`, {
      params,
    });
  }
}
