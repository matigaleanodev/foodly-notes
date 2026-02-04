import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'translate',
  standalone: true,
})
export class TranslatePipeStub implements PipeTransform {
  transform(value: string): string {
    return value;
  }
}
