import { MaterialService, MaterialDatePicker } from './../../shared/classes/material.service';
import { Filter } from './../../shared/interfaces';
import { Component, EventEmitter, OnInit, Output, ViewChild, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-history-filter',
  templateUrl: './history-filter.component.html',
  styleUrls: ['./history-filter.component.css']
})
export class HistoryFilterComponent implements OnInit, OnDestroy, AfterViewInit {

  // tslint:disable-next-line: no-output-on-prefix
  @Output() onFilter = new EventEmitter<Filter>();

  start: MaterialDatePicker;
  end: MaterialDatePicker;
  order: number;
  isValid = true;
  @ViewChild('start') startRef: ElementRef;
  @ViewChild('end') endRef: ElementRef;


  constructor() { }

  ngOnDestroy(): void {
    this.start.destroy();
    this.end.destroy();
  }
  ngAfterViewInit(): void {
    this.start = MaterialService.initDatePicker(this.startRef, this.validate.bind(this));
    this.end = MaterialService.initDatePicker(this.endRef, this.validate.bind(this));
  }

  ngOnInit(): void {
  }

  submitFilter(): void {
    const filter: Filter = {};
    if (this.order) {
      filter.order = this.order;
    }

    if (this.start.date) {
      filter.start = this.start.date;
    }

    if (this.end.date) {
      filter.end = this.end.date;
    }
    this.onFilter.emit(filter);
  }

  validate(): void {
    if (!this.start.date || !this.end.date) {
      this.isValid = true;
      return;
    }

    this.isValid = this.start.date < this.end.date;
  }

}
