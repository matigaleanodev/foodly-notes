import { Component, input, OnInit } from '@angular/core';

@Component({
  selector: 'app-recipe-attr',
  templateUrl: './recipe-attr.component.html',
  styleUrls: ['./recipe-attr.component.scss'],
})
export class RecipeAttrComponent {
  readonly sourceName = input.required<string | null>();
  readonly sourceUrl = input.required<string | null>();
}
