import { TestBed } from '@angular/core/testing';

import { MobilenetTfjsService } from './mobilenet-tfjs.service';

describe('MobilenetTfjsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MobilenetTfjsService = TestBed.get(MobilenetTfjsService);
    expect(service).toBeTruthy();
  });
});
