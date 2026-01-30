import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { SimilarRecipe } from '@recipes/models/similar-recipe.model';
import { RecipeService } from '@recipes/services/recipe/recipe.service';
import { firstValueFrom } from 'rxjs';

export const similarRecipesResolver: ResolveFn<SimilarRecipe[] | null> = async (
  route,
  state,
) => {
  const recipes = inject(RecipeService);
  const id = Number(route.paramMap.get('id'));
  if (!id) return null;

  return firstValueFrom(await recipes.loadSimilaRecipes(id));
};
