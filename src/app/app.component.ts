import { Component, ChangeDetectionStrategy } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular';
import { MenuComponent } from '@shared/components/menu/menu.component';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [IonApp, IonRouterOutlet, MenuComponent],
})
export class AppComponent {
  constructor() {}
}
