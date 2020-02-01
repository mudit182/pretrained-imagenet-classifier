import { Injectable } from '@angular/core';

import { ResnetLayersModelService } from './resnet/resnet-layers-model.service';
import { MobilenetTfjsService } from './mobilenet/mobilenet-tfjs.service';


@Injectable({
  providedIn: 'root'
})
export class ClassificationService {
  currentModelName: string;
  currentModelService: ResnetLayersModelService | MobilenetTfjsService;

  constructor(
    private resnetService: ResnetLayersModelService,
    private mobilenetService: MobilenetTfjsService
  ) { }


  async loadModel(modelName?: string) {
    // set default mobilenet
    if (!modelName) {
      modelName = 'mobilenet';
    }
    // if selected model different
    if (modelName !== this.currentModelName) {
      // delete previous model
      if (this.currentModelService) {
        this.currentModelService.unloadModel();
      }
      // set new model as current model
      this.currentModelName = modelName;
      if (this.currentModelName === 'resnet') {
        this.currentModelService = this.resnetService;
      }
      if (this.currentModelName === 'mobilenet') {
        this.currentModelService = this.mobilenetService;
      }
      // load model
      await this.currentModelService.loadModel();
    } else {
      console.log('Model already loaded');
    }
  }

  async predict(imageEl: HTMLImageElement) {
    // predict
    return await this.currentModelService.predict(imageEl);
  }


}
