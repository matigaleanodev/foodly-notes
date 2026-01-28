import { TestBed } from '@angular/core/testing';
import { RecipeService } from './recipe.service';

describe('RecipeService', () => {
  let service: RecipeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RecipeService],
    });

    service = TestBed.inject(RecipeService);
  });

  it('debería crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  it('debería inicializar la receta seleccionada en null', () => {
    expect(service.selectedRecipe()).toBeNull();
  });

  it('debería generar una lista de recetas', () => {
    const recipes = service.recipes();

    expect(recipes.length).toBeGreaterThan(0);
  });

  it('debería generar 12 recetas', () => {
    const recipes = service.recipes();

    expect(recipes.length).toBe(12);
  });

  it('cada receta debería tener id y título', () => {
    const recipes = service.recipes();

    recipes.forEach((recipe) => {
      expect(recipe.id).toBeDefined();
      expect(recipe.title).toBeDefined();
    });
  });

  it('debería seleccionar una receta', () => {
    const recipe = service.recipes()[0];

    service.seleccionarReceta(recipe);

    expect(service.selectedRecipe()).toEqual(recipe);
  });

  it('no debería modificar la lista de recetas al seleccionar una receta', () => {
    const recipesBefore = service.recipes();
    const recipe = recipesBefore[0];

    service.seleccionarReceta(recipe);

    expect(service.recipes()).toBe(recipesBefore);
  });

  it('las recetas vegetarianas deberían tener la dieta correspondiente', () => {
    const vegetarianRecipes = service.recipes().filter((r) => r.vegetarian);

    vegetarianRecipes.forEach((recipe) => {
      expect(recipe.diets).toContain('vegetarian');
    });
  });
});
