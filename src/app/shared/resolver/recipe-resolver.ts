import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { RecipeInfo } from '@shared/models/recipe.model';
import { RecipeService } from '@shared/services/recipe/recipe.service';

export const recipeResolver: ResolveFn<RecipeInfo | null> = (route, state) => {
  const _recipes = inject(RecipeService);

  const id = Number(route.paramMap.get('id'));

  const selected = _recipes.selectedRecipe();
  if (selected?.id === id) return selected;

  return _recipes.recipes().find((r) => r.id === id) ?? null;
};
