import { Component, output, signal } from '@angular/core';
import {
  IonMenuButton,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonSearchbar,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-home-hero',
  imports: [IonSearchbar, IonButtons, IonToolbar, IonHeader, IonMenuButton],
  templateUrl: './home-hero.component.html',
  styleUrls: ['./home-hero.component.scss'],
})
export class HomeHeroComponent {
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
