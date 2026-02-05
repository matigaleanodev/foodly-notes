export interface DailyRecipe {
  sourceId: number;
  title: string;
  image: string;
}

export interface StoredDaily {
  recipes: DailyRecipe[];
  date: string;
}
