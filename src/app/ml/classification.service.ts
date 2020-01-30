import { Injectable } from '@angular/core';

import * as tf from '@tensorflow/tfjs';
import { TypedArray } from '@tensorflow/tfjs-core/dist/types';

import { IMAGENET_CLASSES } from './imagenet_classes';


@Injectable({
  providedIn: 'root'
})
export class ClassificationService {
  MODEL_URL = 'assets/tfjs-resnet-model/model.json';
  model: tf.LayersModel;
  modelClasses = IMAGENET_CLASSES;

  constructor() { }


  async loadModel() {
    console.log('Fetching model...');
    const modelLoadStartTime = new Date().getTime();
    this.model = await tf.loadLayersModel(this.MODEL_URL);
    const modelLoadDuration = Math.round((new Date().getTime() - modelLoadStartTime) / 1000);
    console.log('Model loaded. Time taken: ', modelLoadDuration, 'sec.');
    return true;
  }

  predict(imageEl: HTMLImageElement) {
    // html image to tf tensor
    const imageTensor = tf.browser.fromPixels(imageEl).toFloat();
    // tensor resize to (224, 224)
    const imageTensorResized = tf.image.resizeBilinear(imageTensor, [224, 224]);
    // tensor RGB to BGR
    const imageTensorBGR = tf.reverse3d(imageTensorResized, 2);
    // tensor subtract respective color channel means
    const meanB = tf.fill([224, 224, 1], 103.939);
    const meanG = tf.fill([224, 224, 1], 116.779);
    const meanR = tf.fill([224, 224, 1], 123.68);
    const meanTensor = tf.concat([meanB, meanG, meanR], 2);
    const imageTensorMeanSubtracted = tf.sub(imageTensorBGR, meanTensor);
    // normalize image (not needed for resnet)
    //// const imageTensorNormalized = tf.div(imageTensorResized.asType('float32'), tf.scalar(255));
    // image to batch of images
    const imageTensorAsBatch = tf.expandDims(imageTensorMeanSubtracted);
    // predict
    const output = (this.model.predict(imageTensorAsBatch) as tf.Tensor<tf.Rank>).dataSync();
    return this.decodeOutput(output);
  }

  decodeOutput(modelOutput: TypedArray) {
    const modelOutputWithLabel: {class: string, prob: number}[] = [];
    modelOutput.forEach((prob: number, index: number) => {
      modelOutputWithLabel.push({class: this.modelClasses[index], prob});
    });
    modelOutputWithLabel.sort((a, b) => b.prob - a.prob);
    return modelOutputWithLabel.slice(0, 3);
  }

}
