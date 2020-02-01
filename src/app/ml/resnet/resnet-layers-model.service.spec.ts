import { TestBed } from '@angular/core/testing';

import { ResnetLayersModelService } from './resnet-layers-model.service';

describe('ResnetLayersModelService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ResnetLayersModelService = TestBed.get(ResnetLayersModelService);
    expect(service).toBeTruthy();
  });
});
