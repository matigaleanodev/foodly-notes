import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { RecipeDetail } from '@recipes/models/recipe-detail.model';
import { RecipeService } from '@recipes/services/recipe/recipe.service';

export const recipeDetailResolver: ResolveFn<RecipeDetail | null> = async (
  route,
  state,
) => {
  const recipe = inject(RecipeService);

  const id = Number(route.paramMap.get('id'));
  if (!id) return null;

  return firstValueFrom(await recipe.loadRecipeDeatil(id));
};
