import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { DailyRecipe } from '@recipes/models/daily-recipe.model';
import { RecipeService } from '@recipes/services/recipe/recipe.service';

export const recipeResolver: ResolveFn<DailyRecipe | null> = (route, state) => {
  const _recipes = inject(RecipeService);

  const sourceId = Number(route.paramMap.get('id'));

  const selected = _recipes.selectedRecipe();
  if (selected?.sourceId === sourceId) return selected;

  return _recipes.recipes().find((r) => r.sourceId === sourceId) ?? null;
};
