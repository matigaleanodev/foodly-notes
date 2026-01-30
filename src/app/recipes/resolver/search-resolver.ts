import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { SearchRecipe } from '@recipes/models/search-recipe.model';
import { RecipeService } from '@recipes/services/recipe/recipe.service';
import { firstValueFrom } from 'rxjs';

export const searchResolver: ResolveFn<SearchRecipe[]> = async (route) => {
  const recipeService = inject(RecipeService);
  const query = route.queryParamMap.get('q');

  if (!query) return [];

  return firstValueFrom(await recipeService.queryReacipeSearch(query));
};
