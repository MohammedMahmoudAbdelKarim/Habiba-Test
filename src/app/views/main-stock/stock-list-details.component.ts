import { Component, Input, Output, EventEmitter } from '@angular/core';
import { popup } from '../../shared-animation/popup';
@Component({
  // tslint:disable-next-line: component-selector
  selector: 'stock-list-details',
  templateUrl: 'stock-list-details.component.html',
  animations: [popup]
})
export class StockListDetailsComponent {
  /* ------------------- Data Binding between Component --------------------- */
  @Input() showDetailsPopUp;
  @Input() itemDetailsData;
  @Output() showDetailsPopUpChange = new EventEmitter<boolean>();
  /* ------------------------------------- Variables ------------------------ */
  totalCost: any = '';
  imgSrc: string = '';
  finalCost: any = '';
  baseUrl: string = 'http://jewelry.ixscope.com/backend/img/products/';
  stockData: any = [];
  pageloaded: boolean = false;
  showUpdataPopup: boolean = false;
  /* ----------------------------------- Constructor ------------------------ */
  constructor() {}
  /* ----------------------------------- OnInit ------------------------ */
  // tslint:disable-next-line: use-lifecycle-interface
  ngOnInit() {
    const sum = [];
    this.itemDetailsData.stones.filter(stone => {
      sum.push(stone.total);
    });
    const total = sum.reduce((a, b) => a + b, 0);
    this.totalCost = total + this.itemDetailsData.gold_total;
    this.finalCost = Math.ceil(this.totalCost * 4.4);
    this.imgSrc = this.baseUrl + this.itemDetailsData.image;
  }
  /* ------------------------------ Close Details Popup --------------------- */
  closeDetailsPopup() {
    this.showDetailsPopUpChange.emit(!this.showDetailsPopUp);
  }
}
