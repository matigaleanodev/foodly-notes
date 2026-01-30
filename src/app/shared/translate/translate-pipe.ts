import { inject, Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from './translate.service';

@Pipe({
  name: 'translate',
  pure: false,
})
export class TranslatePipe implements PipeTransform {
  private _service = inject(TranslateService);

  transform(value: string): string {
    return this._service.translate(value);
  }
}
