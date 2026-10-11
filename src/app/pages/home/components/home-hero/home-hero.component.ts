import { Component, input, output, linkedSignal, ChangeDetectionStrategy } from '@angular/core';
import { TranslatePipe } from '@shared/translate/translate-pipe';

@Component({
  selector: 'app-home-hero',
  imports: [TranslatePipe],
  templateUrl: './home-hero.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./home-hero.component.scss'],
})
export class HomeHeroComponent {
  readonly searchSubmit = output<string>();

  readonly initialQuery = input('');
  readonly query = linkedSignal(() => this.initialQuery());

  handleInput(event: Event) {
    const target = event.target as HTMLInputElement;
    this.query.set(target.value ?? '');
  }

  onEnter() {
    const q = this.query().trim();

    if (!q || q.length > 200) return;

    this.searchSubmit.emit(q);
  }
}
