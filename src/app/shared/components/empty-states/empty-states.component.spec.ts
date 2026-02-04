import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmptyStatesComponent } from './empty-states.component';
import { TranslateService } from '@shared/translate/translate.service';
import { TranslatePipeStub } from '@shared/mocks/translate-pipe.mock';
import { IonicStorageMock } from '@shared/mocks/ionic-storage.mock';

import { Storage } from '@ionic/storage-angular';

describe('EmptyStatesComponent', () => {
  let component: EmptyStatesComponent;
  let fixture: ComponentFixture<EmptyStatesComponent>;

  const translateMock = {
    translate: jasmine
      .createSpy('translate')
      .and.callFake((key: string) => key),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmptyStatesComponent, TranslatePipeStub],
      providers: [
        { provide: Storage, useValue: IonicStorageMock },
        { provide: TranslateService, useValue: translateMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EmptyStatesComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('imagen', 'favorito');
    fixture.componentRef.setInput('text', 'xSinFavoritos');

    fixture.detectChanges();
  });

  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debería renderizar la imagen correspondiente al tipo', () => {
    const img: HTMLImageElement = fixture.nativeElement.querySelector('img');

    expect(img).toBeTruthy();
    expect(img.src).toContain('assets/empty-states/favorito.png');
  });

  it('debería renderizar el texto traducido', () => {
    const text = fixture.nativeElement.textContent;

    expect(translateMock.translate).toHaveBeenCalledWith('xSinFavoritos');
    expect(text).toContain('xSinFavoritos');
  });
});
