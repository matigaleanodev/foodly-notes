import { Component, input } from '@angular/core';
import { TranslatePipe } from '@shared/translate/translate-pipe';

@Component({
  selector: 'app-recipe-attr',
  imports: [TranslatePipe],
  templateUrl: './recipe-attr.component.html',
  styleUrls: ['./recipe-attr.component.scss'],
})
export class RecipeAttrComponent {
  readonly sourceName = input.required<string | null>();
  readonly sourceUrl = input.required<string | null>();
}
