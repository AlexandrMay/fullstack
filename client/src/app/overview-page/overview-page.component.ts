import { IMaterialInstance, MaterialService } from './../shared/classes/material.service';
import { OverviewPage } from './../shared/interfaces';
import { Observable } from 'rxjs';
import { AnalyticsService } from './../shared/services/analytics.service';
import { Component, OnInit, ViewChild, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-overview-page',
  templateUrl: './overview-page.component.html',
  styleUrls: ['./overview-page.component.css']
})
export class OverviewPageComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('tapTarget') tapTargetRef: ElementRef;
  tapTarget: IMaterialInstance;
  data$: Observable<OverviewPage>;
  yesterday = new Date();

  constructor(private service: AnalyticsService) { }

  ngOnDestroy(): void {
    this.tapTarget.destroy();
  }
  ngAfterViewInit(): void {
    this.tapTarget = MaterialService.initTapTarget(this.tapTargetRef);
  }

  ngOnInit(): void {
    this.data$ = this.service.getOverview();
    this.yesterday.setDate(this.yesterday.getDate() - 1);
  }

  openInfo() {
    this.tapTarget.open();
  }

}
