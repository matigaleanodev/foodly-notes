import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TermsPage } from './terms.page';
import { provideRouter } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { IonicStorageMock } from '@shared/mocks/ionic-storage.mock';
import { TranslatePipeStub } from '@shared/mocks/translate-pipe.mock';

describe('TermsPage', () => {
  let component: TermsPage;
  let fixture: ComponentFixture<TermsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TermsPage, TranslatePipeStub],
      providers: [
        provideRouter([]),
        { provide: Storage, useClass: IonicStorageMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TermsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });
});
