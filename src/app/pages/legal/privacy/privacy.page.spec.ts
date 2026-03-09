import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PrivacyPage } from './privacy.page';
import { provideRouter } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { IonicStorageMock } from '@shared/mocks/ionic-storage.mock';
import { TranslatePipeStub } from '@shared/mocks/translate-pipe.mock';

describe('PrivacyPage', () => {
  let component: PrivacyPage;
  let fixture: ComponentFixture<PrivacyPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrivacyPage, TranslatePipeStub],
      providers: [
        provideRouter([]),
        { provide: Storage, useClass: IonicStorageMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PrivacyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });
});
