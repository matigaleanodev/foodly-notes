import { Component, input, output, signal } from '@angular/core';
import { IonSearchbar } from '@ionic/angular/standalone';
import { TranslatePipe } from '@shared/translate/translate-pipe';

@Component({
  selector: 'app-home-hero',
  imports: [IonSearchbar, TranslatePipe],
  templateUrl: './home-hero.component.html',
  styleUrls: ['./home-hero.component.scss'],
})
export class HomeHeroComponent {
  readonly searchSubmit = output<string>();

  readonly query = signal('');

  handleInput(event: Event) {
    const target = event.target as HTMLIonSearchbarElement;
    this.query.set(target.value?.toLowerCase() ?? '');
  }

  onEnter() {
    const q = this.query().trim();

    if (q.length < 3) return;

    this.searchSubmit.emit(q);
    this.query.set('');
  }
}
