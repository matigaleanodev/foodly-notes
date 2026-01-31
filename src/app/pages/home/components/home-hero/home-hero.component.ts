import { Component, input, output, signal } from '@angular/core';
import {
  IonMenuButton,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonSearchbar,
  IonBackButton,
} from '@ionic/angular/standalone';
import { TranslatePipe } from '@shared/translate/translate-pipe';

@Component({
  selector: 'app-home-hero',
  imports: [
    IonBackButton,
    IonSearchbar,
    IonButtons,
    IonToolbar,
    IonHeader,
    IonMenuButton,
    TranslatePipe,
  ],
  templateUrl: './home-hero.component.html',
  styleUrls: ['./home-hero.component.scss'],
})
export class HomeHeroComponent {
  readonly searchPage = input<boolean>(false);
  readonly onSearch = output<string>();

  readonly query = signal('');

  handleInput(event: Event) {
    const target = event.target as HTMLIonSearchbarElement;
    this.query.set(target.value?.toLowerCase() ?? '');
  }

  onEnter() {
    const q = this.query().trim();

    if (q.length < 3) return;

    this.onSearch.emit(q);
  }
}
