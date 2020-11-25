import { Subscription } from 'rxjs';
import { AnalyticsPage } from './../shared/interfaces';
import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { AnalyticsService } from '../shared/services/analytics.service';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-analytics-page',
  templateUrl: './analytics-page.component.html',
  styleUrls: ['./analytics-page.component.css']
})
export class AnalyticsPageComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('gain') gainRef: ElementRef;
  @ViewChild('order') orderRef: ElementRef;

  average: number;
  pending = true;
  aSub: Subscription;

  constructor(private service: AnalyticsService) { }

  ngAfterViewInit(): void {
    const gainConfig: any = {
      label: 'Выручка',
      color: 'rgb(255, 99, 132)'
    };
    const orderConfig: any = {
      label: 'Заказы',
      color: 'rgb(54, 162, 235)'
    };
    this.aSub = this.service.getAnalytics().subscribe((data: AnalyticsPage) => {
      this.average = data.average;
      gainConfig.labels = data.chart.map(item => item.label);
      gainConfig.data = data.chart.map(item => item.gain);

      orderConfig.labels = data.chart.map(item => item.label);
      orderConfig.data = data.chart.map(item => item.order);

      const gainCtx = this.gainRef.nativeElement.getContext('2d');
      gainCtx.canvas.height = '300px';

      const orderCtx = this.orderRef.nativeElement.getContext('2d');
      gainCtx.canvas.height = '300px';

      // tslint:disable-next-line:no-unused-expression
      new Chart(gainCtx, createChartConfig(gainConfig));
      // tslint:disable-next-line:no-unused-expression
      new Chart(orderCtx, createChartConfig(orderConfig));

      this.pending = false;
    });
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    if (this.aSub) {
      this.aSub.unsubscribe();
    }
  }
}

function createChartConfig({labels, data, label, color}) {
  return {
    type: 'line',
    options: {
      responsive: true
    },
    data: {
      labels,
      datasets: [
        {
          label,
          data,
          borderColor: color,
          steppedLine: false,
          fill: false
        }
      ]
    }
  };
}
