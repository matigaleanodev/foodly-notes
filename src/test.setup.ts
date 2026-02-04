import { TestBed } from '@angular/core/testing';
import { TranslatePipe } from '@shared/translate/translate-pipe';

export function overrideTranslatePipe() {
  TestBed.overridePipe(TranslatePipe, {
    set: {
      transform: (value: string) => value,
    } as any,
  });
}
