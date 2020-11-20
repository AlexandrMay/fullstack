import { IMaterialInstance, MaterialService } from './../../shared/classes/material.service';
import { Order } from './../../shared/interfaces';
import { Component, Input, OnInit, ViewChild, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-history-list',
  templateUrl: './history-list.component.html',
  styleUrls: ['./history-list.component.css']
})
export class HistoryListComponent implements OnInit, OnDestroy, AfterViewInit {

  @Input() orders: Order[];
  @ViewChild('modal') modalRef: ElementRef;
  modal: IMaterialInstance;
  selectedOrder: Order;

  constructor() { }
  ngOnDestroy(): void {
    this.modal.destroy();
  }
  ngAfterViewInit(): void {
    this.modal = MaterialService.initModal(this.modalRef);
  }

  ngOnInit(): void {
  }

  computePrice(order: Order): number {
    return order.list.reduce((total, item) => {
      return total += item.quantity * item.cost;
    }, 0);
  }

  selectOrder(order) {
    this.selectedOrder = order;
    this.modal.open();
  }

  closeModal(){
    this.modal.close();
  }
}