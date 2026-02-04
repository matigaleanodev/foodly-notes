import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InfoPage } from './info.page';
import { IonicStorageMock } from '@shared/mocks/ionic-storage.mock';
import { Storage } from '@ionic/storage-angular';

describe('InfoPage', () => {
  let component: InfoPage;
  let fixture: ComponentFixture<InfoPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfoPage],
      providers: [{ provide: Storage, useValue: IonicStorageMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(InfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debería exponer las URLs configuradas', () => {
    expect(component.githubUrl).toContain('github.com');
    expect(component.helpUrl).toContain('github.com');
    expect(component.privacyUrl).toContain('privacy');
    expect(component.termsUrl).toContain('terms');
  });
});
