import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { TABS, TabsPage } from './tabs.page';
import { Storage } from '@ionic/storage-angular';
import { IonicStorageMock } from '@shared/mocks/ionic-storage.mock';
import { TranslatePipeStub } from '@shared/mocks/translate-pipe.mock';

describe('TabsPage', () => {
  let component: TabsPage;
  let fixture: ComponentFixture<TabsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabsPage, TranslatePipeStub],
      providers: [
        provideRouter([]),
        { provide: Storage, useValue: IonicStorageMock },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TabsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear la página de tabs', () => {
    expect(component).toBeTruthy();
  });

  it('debería exponer los tabs definidos', () => {
    expect(component.tabs().length).toBe(3);
    expect(component.tabs()).toEqual(TABS);
  });
});
