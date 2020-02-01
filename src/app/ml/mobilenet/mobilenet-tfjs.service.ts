import { Injectable } from '@angular/core';

import * as mobilenet from '@tensorflow-models/mobilenet';


@Injectable({
  providedIn: 'root'
})
export class MobilenetTfjsService {
  model: mobilenet.MobileNet;

  constructor() { }

  async loadModel(): Promise<boolean> {
    console.log('Fetching mobilenet model...');
    const modelLoadStartTime = new Date().getTime();
    this.model = await mobilenet.load();
    const modelLoadDuration = Math.round((new Date().getTime() - modelLoadStartTime) / 1000);
    console.log('Model loaded. Time taken: ', modelLoadDuration, 'sec.');
    return true;
  }

  async predict(imageEl: HTMLImageElement): Promise<{className: string, probability: number}[]> {
    const decodedOutput = await this.model.classify(imageEl);
    return decodedOutput;
  }

  unloadModel() {}

}
