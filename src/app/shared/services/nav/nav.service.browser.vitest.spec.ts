import { TestBed } from '@angular/core/testing';
import { NavController } from '@ionic/angular/standalone';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { NavService } from './nav.service';

describe('NavService (Vitest browser)', () => {
  let service: NavService;

  const navControllerMock = {
    navigateForward: vi.fn(),
    back: vi.fn(),
    navigateRoot: vi.fn(),
  };

  beforeEach(() => {
    navControllerMock.navigateForward.mockReset();
    navControllerMock.back.mockReset();
    navControllerMock.navigateRoot.mockReset();

    TestBed.configureTestingModule({
      providers: [
        NavService,
        { provide: NavController, useValue: navControllerMock },
      ],
    });

    service = TestBed.inject(NavService);
  });

  it('navigates forward with optional query params', () => {
    service.forward('/test');

    expect(navControllerMock.navigateForward).toHaveBeenCalledWith('/test', {
      queryParams: undefined,
      animated: true,
      animationDirection: 'forward',
    });
  });

  it('navigates back', () => {
    service.back();

    expect(navControllerMock.back).toHaveBeenCalled();
  });

  it('navigates to root with replaceUrl', () => {
    service.root('/root');

    expect(navControllerMock.navigateRoot).toHaveBeenCalledWith('/root', {
      replaceUrl: true,
    });
  });

  it('navigates to home through volverHome', () => {
    service.volverHome();

    expect(navControllerMock.navigateRoot).toHaveBeenCalledWith('/home', {
      replaceUrl: true,
    });
  });

  it('navigates to search when query is valid', () => {
    service.search('  pollo  ');

    expect(navControllerMock.navigateForward).toHaveBeenCalledWith('/search', {
      queryParams: { q: 'pollo' },
      animated: true,
      animationDirection: 'forward',
    });
  });

  it('does not navigate to search when query is empty', () => {
    service.search('   ');

    expect(navControllerMock.navigateForward).not.toHaveBeenCalled();
  });
});
