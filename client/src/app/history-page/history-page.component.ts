import { Order, Filter } from './../shared/interfaces';
import { Subscription } from 'rxjs';
import { OrdersService } from './../shared/services/orders.service';
import { IMaterialInstance, MaterialService } from './../shared/classes/material.service';
import { Component, OnInit, ViewChild, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';

const STEP = 2;

@Component({
  selector: 'app-history-page',
  templateUrl: './history-page.component.html',
  styleUrls: ['./history-page.component.css']
})
export class HistoryPageComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('tooltip') tooltipRef: ElementRef;
  tooltip: IMaterialInstance;
  isFilterVisible = false;
  offset = 0;
  limit = STEP;
  oSub: Subscription;
  orders: Order[] = [];
  loading = false;
  reloading = false;
  noMoreOrders = false;
  filter: Filter = {};

  constructor(private ordersService: OrdersService) { }
  ngOnDestroy(): void {
    this.tooltip.destroy();
    this.oSub.unsubscribe();
  }
  ngAfterViewInit(): void {
    this.tooltip = MaterialService.initTooltip(this.tooltipRef);
  }

  ngOnInit(): void {
    this.fetch();
    this.reloading = true;
  }

  private fetch(): void {
    const params = Object.assign({}, this.filter, {
      offset: this.offset,
      limit: this.limit
    });
    this.oSub = this.ordersService.fetch(params).subscribe(
      orders => {
        this.orders = this.orders.concat(orders);
        this.noMoreOrders = orders.length < STEP;
        this.loading = false;
        this.reloading = false;
      }
    );
  }

  loadMore(): void {
    this.offset += STEP;
    this.loading = true;
    this.fetch();
  }

  applyFilter(filter: Filter): void {
    this.orders = [];
    this.offset = 0;
    this.reloading = true;
    this.filter = filter;
    this.fetch();
  }

  isFiltered(): boolean {
    return Object.keys(this.filter).length !== 0;
  }


}
