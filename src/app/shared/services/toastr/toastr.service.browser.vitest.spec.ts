import { TestBed } from '@angular/core/testing';
import { ToastController } from '@ionic/angular/standalone';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ToastrService } from './toastr.service';

describe('ToastrService (Vitest)', () => {
  let service: ToastrService;

  const toastElementMock = {
    present: vi.fn().mockResolvedValue(undefined),
  } as unknown as HTMLIonToastElement;

  const toastControllerMock = {
    create: vi.fn().mockResolvedValue(toastElementMock),
  };

  beforeEach(() => {
    toastControllerMock.create.mockClear();
    (toastElementMock.present as ReturnType<typeof vi.fn>).mockClear();

    TestBed.configureTestingModule({
      providers: [
        ToastrService,
        { provide: ToastController, useValue: toastControllerMock },
      ],
    });

    service = TestBed.inject(ToastrService);
  });

  it('creates the service', () => {
    expect(service).toBeTruthy();
  });

  it('shows an error toast', async () => {
    await service.danger('Error grave');

    expect(toastControllerMock.create).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Error grave',
        color: 'danger',
        icon: 'alert-circle-outline',
        header: 'Error',
      }),
    );

    expect(toastElementMock.present).toHaveBeenCalled();
  });

  it('shows a success toast', async () => {
    await service.success('Todo OK', 'Exito');

    expect(toastControllerMock.create).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Todo OK',
        color: 'success',
        icon: 'checkmark-circle-outline',
        header: 'Exito',
      }),
    );

    expect(toastElementMock.present).toHaveBeenCalled();
  });
});
