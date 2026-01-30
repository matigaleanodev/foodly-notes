import { Component, input, OnInit } from '@angular/core';
import { RecipeInstruction } from '@recipes/models/recipe-instruction.model';
import { TranslatePipe } from '@shared/translate/translate-pipe';

@Component({
  selector: 'app-recipe-instructions',
  imports: [TranslatePipe],
  templateUrl: './recipe-instructions.component.html',
  styleUrls: ['./recipe-instructions.component.scss'],
})
export class RecipeInstructionsComponent {
  readonly instructions = input.required<RecipeInstruction[]>();
}
