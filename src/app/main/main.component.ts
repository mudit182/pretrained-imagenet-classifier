import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ClassificationService } from '../ml/classification.service';



@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  images: string[] = [];

  constructor(private route: ActivatedRoute, private classificationService: ClassificationService) { }

  ngOnInit() {
    for (let index = 1; index < 33; index++) {
      this.images.push(index + '.jpg');
    }

    this.route.url.subscribe((route: any) => {
      console.log(route);
      if (route.path === 'resnet') {
        this.classificationService.loadModel('resnet');
      } else {
        this.classificationService.loadModel('mobilenet');
      }
    });

  }

}
