import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet, IonContent } from '@ionic/angular/standalone';
import { MenuComponent } from '@shared/components/menu/menu.component';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonContent, IonApp, IonRouterOutlet, MenuComponent],
})
export class AppComponent {
  constructor() {}
}
