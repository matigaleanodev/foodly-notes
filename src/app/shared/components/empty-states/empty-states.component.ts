import { Component, input } from '@angular/core';
import { TranslatePipe } from '@shared/translate/translate-pipe';

@Component({
  selector: 'app-empty-states',
  imports: [TranslatePipe],
  templateUrl: './empty-states.component.html',
  styleUrls: ['./empty-states.component.scss'],
})
export class EmptyStatesComponent {
  readonly imagen = input.required<'favorito' | 'receta' | 'shoplist'>();
  readonly text = input.required<string>();
}
