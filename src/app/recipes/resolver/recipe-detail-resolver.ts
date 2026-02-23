import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { LoadingController } from '@ionic/angular/standalone';
import { firstValueFrom } from 'rxjs';
import { RecipeDetail } from '@recipes/models/recipe-detail.model';
import { RecipeService } from '@recipes/services/recipe/recipe.service';

export const recipeDetailResolver: ResolveFn<RecipeDetail | null> = async (
  route,
) => {
  const recipe = inject(RecipeService);
  const loadingCtrl = inject(LoadingController);

  const id = Number(route.paramMap.get('id'));
  if (!id) return null;

  const loading = await loadingCtrl.create({
    spinner: 'crescent',
    translucent: true,
    cssClass: 'recipe-detail-loading',
  });

  await loading.present();

  try {
    return firstValueFrom(await recipe.loadRecipeDeatil(id));
  } finally {
    await loading.dismiss();
  }
};
