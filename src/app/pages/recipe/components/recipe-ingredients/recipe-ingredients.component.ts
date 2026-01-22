import { Component, input, OnInit } from '@angular/core';
import { Ingredient } from '@shared/models/recipe.model';

@Component({
  selector: 'app-recipe-ingredients',
  imports: [],
  templateUrl: './recipe-ingredients.component.html',
  styleUrls: ['./recipe-ingredients.component.scss'],
})
export class RecipeIngredientsComponent {
  readonly ingredients = input.required<Ingredient[]>();

  ngOnInit() {
    console.log(this.ingredients());
  }
}
