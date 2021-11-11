import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { collapseTextChangeRangesAcrossMultipleVersions } from 'typescript';

import { AffineTransformationService } from '../affine-transformation.service';

@Component({
  selector: 'app-triangle-transformations',
  templateUrl: './triangle-transformations.component.html',
  styleUrls: ['./triangle-transformations.component.css']
})
export class TriangleTransformationsComponent implements OnInit {

  constructor (private transformService: AffineTransformationService) {
  }

  @ViewChild('scene')
  scene: ElementRef<HTMLCanvasElement>;
  sceneNative;

  triangles:any = {
    start: {
      AX: 0,
      AY: 0,
      BX: 0,
      BY: 200,
      CX: 200,
      CY: 0,
    },
    finish: {
      AX: 800,
      AY: 100,
      BX: 1200,
      BY: 100,
      CX: 700,
      CY: 600,
    },
  }

  matrix = {
    a: 1,
    b: 2,
    c: 0,
    d: 1,
  };

  offset = {
    x: 1000,
    y: 400,
  }

  ngOnInit(): void {
    window.onscroll = window.onresize = this.initScene.bind(this);
  }

  ngAfterViewInit() {
    this.initScene();
  }

  initScene() {
    this.sceneNative = this.scene.nativeElement;
    this.sceneNative.width = window.innerWidth - 200;
    this.sceneNative.height = this.sceneNative.width / 2;
  }

  onTriangleInputsUpdated($event) {
  }

  clear() {
    let context = this.sceneNative.getContext('2d');
    context.clearRect(0, 0, this.sceneNative.width, this.sceneNative.height);
  }

  async delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
  }

  async draw() {
    this.drawTriangle(this.triangles.start);
    
    const frames = this.transformService.frames(250, this.triangles.start, this.matrix, this.offset);
    for (let frame of frames) {
      await this.delay(10);
      this.drawTriangle(frame, "red");
    }

    this.triangles.finish = this.transformService.transform(this.triangles.start, this.matrix, this.offset);
    this.drawTriangle(this.triangles.finish);
  }

  drawTriangle(t, c = "black") {
    let context = this.scene.nativeElement.getContext('2d');
    context.beginPath()
    context.moveTo(t.AX, t.AY);
    context.lineTo(t.BX, t.BY);
    context.lineTo(t.CX, t.CY);
    context.lineTo(t.AX, t.AY);
    context.strokeStyle = c;
    context.stroke();
  }
}
