import { TestBed } from '@angular/core/testing';
import { NavService } from './nav.service';
import { NavController } from '@ionic/angular/standalone';

describe('NavService', () => {
  let service: NavService;

  const navControllerMock = {
    navigateForward: jasmine.createSpy(),
    back: jasmine.createSpy(),
    navigateRoot: jasmine.createSpy(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        NavService,
        { provide: NavController, useValue: navControllerMock },
      ],
    });

    service = TestBed.inject(NavService);
  });

  it('debería crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  it('debería navegar hacia adelante', () => {
    service.forward('/test');

    expect(navControllerMock.navigateForward).toHaveBeenCalledWith('/test');
  });

  it('debería volver hacia atrás', () => {
    service.back();

    expect(navControllerMock.back).toHaveBeenCalled();
  });

  it('debería navegar a la raíz con replaceUrl', () => {
    service.root('/root');

    expect(navControllerMock.navigateRoot).toHaveBeenCalledWith('/root', {
      replaceUrl: true,
    });
  });

  it('debería volver al home', () => {
    service.volverHome();

    expect(navControllerMock.navigateRoot).toHaveBeenCalledWith('/home', {
      replaceUrl: true,
    });
  });
});
