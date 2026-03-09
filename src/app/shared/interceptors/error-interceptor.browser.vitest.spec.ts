import { TestBed } from '@angular/core/testing';
import {
  HttpErrorResponse,
  HttpHandlerFn,
  HttpRequest,
} from '@angular/common/http';
import { TimeoutError, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { errorInterceptor } from './error-interceptor';
import { ToastrService } from '@shared/services/toastr/toastr.service';
import { TranslateService } from '@shared/translate/translate.service';

describe('errorInterceptor (Vitest)', () => {
  const toastrMock = {
    danger: vi.fn(),
  };

  const translateMock = {
    translate: vi.fn((key: string) => key),
  };

  const interceptor = (req: HttpRequest<unknown>, next: HttpHandlerFn) =>
    TestBed.runInInjectionContext(() => errorInterceptor(req, next));

  beforeEach(() => {
    toastrMock.danger.mockReset();
    translateMock.translate.mockClear();

    TestBed.configureTestingModule({
      providers: [
        { provide: ToastrService, useValue: toastrMock },
        { provide: TranslateService, useValue: translateMock },
      ],
    });
  });

  it('handles TimeoutError', async () => {
    const req = new HttpRequest('GET', '/test');

    const next: HttpHandlerFn = () => throwError(() => new TimeoutError());

    await expect(
      new Promise((_, reject) => {
        interceptor(req, next).subscribe({
          error: reject,
        });
      }),
    ).rejects.toBeInstanceOf(TimeoutError);

    expect(translateMock.translate).toHaveBeenCalledWith('xErrorTimeout');
    expect(toastrMock.danger).toHaveBeenCalledWith('xErrorTimeout');
  });

  it('handles connection HttpErrorResponse', async () => {
    const req = new HttpRequest('GET', '/test');

    const httpError = new HttpErrorResponse({
      status: 0,
      url: '/test',
      error: new ProgressEvent('error'),
    });

    const next: HttpHandlerFn = () => throwError(() => httpError);

    await expect(
      new Promise((_, reject) => {
        interceptor(req, next).subscribe({
          error: reject,
        });
      }),
    ).rejects.toBe(httpError);

    expect(translateMock.translate).toHaveBeenCalledWith('xErrorConexion');
    expect(toastrMock.danger).toHaveBeenCalledWith('xErrorConexion');
  });

  it('handles generic HttpErrorResponse', async () => {
    const req = new HttpRequest('GET', '/test');

    const httpError = new HttpErrorResponse({
      status: 500,
      url: '/test',
      error: { message: 'boom' },
    });

    const next: HttpHandlerFn = () => throwError(() => httpError);

    await expect(
      new Promise((_, reject) => {
        interceptor(req, next).subscribe({
          error: reject,
        });
      }),
    ).rejects.toBe(httpError);

    expect(translateMock.translate).toHaveBeenCalledWith('xErrorDesconocido');
    expect(toastrMock.danger).toHaveBeenCalledWith('xErrorDesconocido');
  });
});
