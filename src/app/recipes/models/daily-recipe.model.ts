export interface DailyRecipe {
  sourceId: number;
  title: string;
  image: string;
}

export interface StoredDaily {
  recipes: DailyRecipe[];
  date: string;
}

export function isRecipeSummary(value: unknown): value is DailyRecipe {
  if (!value || typeof value !== 'object') return false;
  const recipe = value as Record<string, unknown>;
  return Number.isSafeInteger(recipe['sourceId']) && Number(recipe['sourceId']) > 0
    && typeof recipe['title'] === 'string' && recipe['title'].trim().length > 0
    && typeof recipe['image'] === 'string';
}
