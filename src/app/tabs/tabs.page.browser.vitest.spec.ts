import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it } from 'vitest';

import { TABS, TabsPage } from './tabs.page';
import { Storage } from '@ionic/storage-angular';
import { IonicStorageMock } from '@shared/mocks/ionic-storage.mock';
import { TranslatePipeStub } from '@shared/mocks/translate-pipe.mock';

describe('TabsPage (Vitest)', () => {
  let component: TabsPage;
  let fixture: ComponentFixture<TabsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabsPage, TranslatePipeStub],
      providers: [
        provideRouter([]),
        { provide: Storage, useClass: IonicStorageMock },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TabsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates the tabs page', () => {
    expect(component).toBeTruthy();
  });

  it('exposes the defined tabs', () => {
    expect(component.tabs().length).toBe(3);
    expect(component.tabs()).toEqual(TABS);
  });
});
