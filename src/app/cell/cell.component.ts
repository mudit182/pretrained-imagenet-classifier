import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { ClassificationService } from '../ml/classification.service';

@Component({
  selector: 'app-cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.scss']
})
export class CellComponent implements OnInit {
  @Input() image: string;
  @ViewChild('imageSelector', {static: false}) imageEl: ElementRef;

  predictions: {class: string, prob: number}[] = [];

  constructor(private classificationService: ClassificationService) { }

  ngOnInit() {
  }

  getImagePath() {
    return 'assets/test_images/' + this.image;
  }

  predict() {
    if (this.predictions.length === 0) {
      this.predictions = this.classificationService.predict(this.imageEl.nativeElement);
    }
  }

}
