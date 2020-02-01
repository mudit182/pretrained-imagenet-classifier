import { Injectable } from '@angular/core';

import * as tf from '@tensorflow/tfjs';
import { TypedArray } from '@tensorflow/tfjs-core/dist/types';

import { IMAGENET_CLASSES } from '../imagenet_classes';
import { Tensor3D, Tensor4D } from '@tensorflow/tfjs';


@Injectable({
  providedIn: 'root'
})
export class ResnetLayersModelService {
  MODEL_URL = 'assets/tfjs-resnet-model/model.json';
  model: tf.LayersModel;
  modelClasses = IMAGENET_CLASSES;


  constructor() { }

  async loadModel(): Promise<boolean> {
    console.log('Fetching resnet model...');
    const modelLoadStartTime = new Date().getTime();
    this.model = await tf.loadLayersModel(this.MODEL_URL);
    const modelLoadDuration = Math.round((new Date().getTime() - modelLoadStartTime) / 1000);
    console.log('Model loaded. Time taken: ', modelLoadDuration, 'sec.');
    return true;
  }

  predict(imageEl: HTMLImageElement): {className: string, probability: number}[] {
    // preprocess image
    const imageAsModelInput = this.preprocessImage(imageEl);
    // predict
    const output = (this.model.predict(imageAsModelInput) as tf.Tensor4D).dataSync();
    // get class names from model output
    return this.decodeOutput(output);
  }

  unloadModel() {}

  private decodeOutput(modelOutput: TypedArray): {className: string, probability: number}[] {
    const modelOutputWithLabel: {className: string, probability: number}[] = [];
    modelOutput.forEach((prob: number, index: number) => {
      modelOutputWithLabel.push({className: this.modelClasses[index], probability: prob});
    });
    modelOutputWithLabel.sort((a, b) => b.probability - a.probability);
    return modelOutputWithLabel.slice(0, 3);
  }

  private preprocessImage(imageEl: HTMLImageElement): tf.Tensor4D {
    // html image to 3d tensor of pixels (width, height,  color_channels)
    const imageTensor = tf.browser.fromPixels(imageEl).toFloat();
    // tensor resize (width, height) to (224, 224)
    const imageTensorResized = tf.image.resizeBilinear(imageTensor, [224, 224]);
    // tensor switch color channel order RGB to BGR
    const imageTensorBGR = tf.reverse3d(imageTensorResized, 2);
    // tensor subtract respective color channel means
    const meanB = tf.fill([224, 224, 1], 103.939) as Tensor3D;
    const meanG = tf.fill([224, 224, 1], 116.779) as Tensor3D;
    const meanR = tf.fill([224, 224, 1], 123.68) as Tensor3D;
    const meanTensor = tf.concat([meanB, meanG, meanR], 2);
    const imageTensorMeanSubtracted = tf.sub(imageTensorBGR, meanTensor) as Tensor3D;
    // normalize image (not needed for resnet)
    //// const imageTensorNormalized = tf.div(imageTensorResized.asType('float32'), tf.scalar(255));
    // single image to batch of images
    const imageTensorAsBatch = tf.expandDims(imageTensorMeanSubtracted) as Tensor4D;
    return imageTensorAsBatch;
  }

}
