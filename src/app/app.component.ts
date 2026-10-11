import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslatePipe } from '@shared/translate/translate-pipe';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { IonApp, IonRouterOutlet, IonMenuButton } from '@ionic/angular';
import { MenuComponent } from '@shared/components/menu/menu.component';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [IonApp, IonRouterOutlet, IonMenuButton, MenuComponent, RouterLink, RouterLinkActive, TranslatePipe],
})
export class AppComponent {
  constructor() {}
}
