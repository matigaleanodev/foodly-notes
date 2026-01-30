import { Injectable, inject } from '@angular/core';
import { LoadingController } from '@ionic/angular/standalone';
import { TranslateService } from '@shared/translate/translate.service';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  private readonly _loadingCtrl = inject(LoadingController);
  private readonly _translator = inject(TranslateService);

  async show(keyMessage = 'xCargando') {
    const message = this._translator.translate(keyMessage);
    const loading = await this._loadingCtrl.create({
      message,
      spinner: 'crescent',
    });

    await loading.present();

    return loading;
  }
}
