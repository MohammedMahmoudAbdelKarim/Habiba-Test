import { ActivatedRoute } from '@angular/router';
import { MainServiceService } from './../../shared-services/main-service.service';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild
} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ModalDirective } from 'ngx-bootstrap';
@Component({
  // tslint:disable-next-line: component-selector
  selector: 'stock-list-edit',
  templateUrl: 'stock-list-edit.component.html'
})
// tslint:disable-next-line: class-name
export class stockListEditComponent {
  /* -------------------- Data Binding between Components ------------------- */
  @Input() getSearchStatus: boolean;
  @Output() stockListPageReloadAfterUpdate = new EventEmitter<boolean>();
  @Output() stockL = new EventEmitter<boolean>();
  @Input() showUpdatePopUp: any;
  @Input() reloadAfterUpdate: any;
  @Output() showUpdatePopUpChange = new EventEmitter<boolean>();
  @Output() updatedStock = new EventEmitter<boolean>();
  @Input() updatedItemData: any;
  @Output() reloadStockList = new EventEmitter<boolean>();
  /* ------------------------------------- Variables ------------------------ */
  // Modals
  @ViewChild('myModal', { static: false }) public myModal: ModalDirective;
  // Boolean
  checkItemDataCalculatedIsDefiend: boolean = false;
  testValueBoolean: boolean = true;
  stoneFlage: boolean = false;
  stoneTotal: any;
  stonePrice: any;
  stonesArray: any;
  stoneSetting: any;
  newPriceValue: any;
  newWeightValue: any;
  newSettingValue: any;
  newQuantityValue: any;
  newGoldPriceValue: any;
  newGoldWeightValue: any;
  ItemDataCalculated: any;
  stoneList: any = [];
  modalError: any = [];
  newStoneArray: any = [];
  testStonesArray: any = [];
  imgSrc: string;
  stone_id: any = '';
  baseUrl: string = 'http://jewelry.inspia.net/backend/img/products/';
  /* ------------------------------------- Form ------------------------ */
  // Stock Form
  stockUpdatForm = new FormGroup({
    updateStockTotalPrice: new FormControl(''),
    updateGoldWeight: new FormControl(''),
    updateGoldPrice: new FormControl(''),
    updateStonesQuantity: new FormControl(''),
    updateSettingsSetting: new FormControl(''),
    updateStonesWeight: new FormControl(''),
    updateStonesPrice: new FormControl(''),
    goldTotalPrice: new FormControl(''),
    stoneTotal: new FormControl(''),
    stoneTotal1: new FormControl(''),
    stoneTotal2: new FormControl('')
  });
  // Add New Stone Form
  stonesForm = new FormGroup({
    id: new FormControl(''),
    name: new FormControl('', Validators.required),
    setting: new FormControl('', Validators.required),
    price: new FormControl('', Validators.required),
    weight: new FormControl('', Validators.required),
    quantity: new FormControl('', Validators.required),
    total: new FormControl('')
  });
  /* ----------------------------------- Constructor ------------------------ */
  constructor(
    private api: MainServiceService,
    private toast: ToastrService,
    private route: ActivatedRoute
  ) {
    this.route.data.subscribe(data => {
      // Get Stones
      this.stoneList = data.stones.data.data;
    });
  }
  /* ----------------------------------- OnInit ------------------------ */
  // tslint:disable-next-line: use-lifecycle-interface
  ngOnInit() {
    this.assignUpdatedData();
    this.ItemDataCalculated = Object.assign({}, this.updatedItemData);
    for (let i = 0; i < this.ItemDataCalculated.length; i++) {}
    const items = this.updatedItemData.stones;
    let sum = null;
    items.forEach((value, index, arry) => {
      sum += value.total;
    });
    if ((this.testValueBoolean = false)) {
      this.newStoneArray = [];
    }
  }
  /* ---------------------------------- Get Stone ID ------------------------ */
  getSelectedListOptionId() {
    // Get Stone Name
    const name = this.stonesForm.value.name;
    for (const stone of this.stoneList) {
      if (name === stone.name) {
        console.log(stone);
        this.stone_id = stone.id;
        console.log(this.stone_id);
      }
    }
  }
  /* ---------------------------------- Remove Stone ------------------------ */
  removeStone(i) {
    this.checkItemDataCalculatedIsDefiend = true;
    this.testStonesArray.splice(i, 1);
    // Start Calculate Total of Stone Total
    const items = this.ItemDataCalculated.stones;
    let sum = null;
    items.forEach(value => {
      sum += value.total;
    });
    // End Calculate Total of Stone Total
    this.ItemDataCalculated.item_total =
      this.ItemDataCalculated.gold_total + sum;
    this.ItemDataCalculated.item_total_after_profit = Math.ceil(
      this.ItemDataCalculated.item_total * 4.4
    );
  }
  /* ------------------------------ Create New Stone ------------------------ */
  onSubmitStone(form) {
    this.newStoneArray = this.testStonesArray;
    form.value.id = this.stone_id;
    form.value.total = Math.ceil(
      form.value.quantity * form.value.price +
        form.value.weight * form.value.setting
    );
    if (
      form.value.name &&
      form.value.price &&
      form.value.quantity &&
      form.value.setting &&
      form.value.weight
    ) {
      this.checkItemDataCalculatedIsDefiend = true;
      this.stoneFlage = true;
      this.newStoneArray.push(form.value);
      this.myModal.hide();
      const items = this.ItemDataCalculated.stones;
      let sum = null;
      items.forEach(value => {
        sum += value.total;
      });
      this.ItemDataCalculated.item_total =
        this.ItemDataCalculated.gold_total + sum;
      this.ItemDataCalculated.item_total_after_profit = Math.ceil(
        this.ItemDataCalculated.item_total * 4.4
      );
    } else {
      this.api.fireAlert('error', 'Please Fill in All Data', '');
    }
    this.stone_id = '';
  }
  /* --------------------------- Assign Updated Data ------------------------ */
  assignUpdatedData() {
    const data = this.updatedItemData;
    this.imgSrc = this.baseUrl + data.image;
    this.stonePrice = +data.price;
    this.stoneSetting = +data.setting;
    this.stockUpdatForm.controls.updateGoldWeight.setValue(+data.gold_weight);
    this.stockUpdatForm.controls.updateGoldPrice.setValue(+data.gold_price);
    this.stockUpdatForm.controls.goldTotalPrice.setValue(+data.gold_total);
    this.testStonesArray = data.stones;
  }
  /* --------------------------- Number Validation ------------------------ */
  numberCheckValidation(e) {
    if ((48 <= e.keyCode && e.keyCode <= 57) || e.keyCode === 46) {
    } else {
      return false;
    }
  }
  /* --------------------- Total Calculate Stone Total ---------------------- */
  calculateStoneTotal(e, stoneIndex, key) {
    this.checkItemDataCalculatedIsDefiend = true;
    if (this.ItemDataCalculated.stones.length > 0) {
      this.stonesArray = this.ItemDataCalculated.stones;
      if (key === 'gW') {
        this.newGoldWeightValue = e.target.value;
        this.ItemDataCalculated.gold_weight = this.newGoldWeightValue;
        this.ItemDataCalculated.gold_total =
          this.ItemDataCalculated.gold_weight *
          this.ItemDataCalculated.gold_price;
      }
      if (key === 'gP') {
        this.newGoldPriceValue = e.target.value;
        this.ItemDataCalculated.gold_price = this.newGoldPriceValue;
        this.ItemDataCalculated.gold_total =
          this.ItemDataCalculated.gold_weight *
          this.ItemDataCalculated.gold_price;
      } else {
        if (key === 'sQ') {
          this.newQuantityValue = e.target.value;
          this.stonesArray[stoneIndex].quantity = this.newQuantityValue;
        }
        if (key === 'sW') {
          this.newWeightValue = e.target.value;
          this.stonesArray[stoneIndex].weight = this.newWeightValue;
        }
        if (key === 'sP') {
          this.newPriceValue = e.target.value;
          this.stonesArray[stoneIndex].price = this.newPriceValue;
        }
        if (key === 'sS') {
          this.newSettingValue = e.target.value;
          this.stonesArray[stoneIndex].setting = this.newSettingValue;
        }
        const stoneTotal =
          this.stonesArray[stoneIndex].quantity *
            this.stonesArray[stoneIndex].setting +
          this.stonesArray[stoneIndex].weight *
            this.stonesArray[stoneIndex].price;
        // Set New Stone
        this.stonesArray[stoneIndex].total = stoneTotal;
      }
      // Start Calculate Total of Stone Total
      const items = this.ItemDataCalculated.stones;
      let sum = null;
      items.forEach(value => {
        sum += value.total;
      });
      // End Calculate Total of Stone Total
      this.ItemDataCalculated.item_total =
        this.ItemDataCalculated.gold_total + sum;
      this.ItemDataCalculated.item_total_after_profit =
        this.ItemDataCalculated.item_total * 4.4;
    } else {
      if (key === 'gW') {
        this.newGoldWeightValue = e.target.value;
        this.ItemDataCalculated.gold_weight = this.newGoldWeightValue;
        this.ItemDataCalculated.gold_total =
          this.ItemDataCalculated.gold_weight *
          this.ItemDataCalculated.gold_price;
      }
      if (key === 'gP') {
        this.newGoldPriceValue = e.target.value;
        this.ItemDataCalculated.gold_price = this.newGoldPriceValue;
        this.ItemDataCalculated.gold_total =
          this.ItemDataCalculated.gold_weight *
          this.ItemDataCalculated.gold_price;
      }
      this.ItemDataCalculated.item_total = this.ItemDataCalculated.gold_total;
      this.ItemDataCalculated.item_total_after_profit = Math.ceil(
        this.ItemDataCalculated.item_total * 4.4
      );
    }
  }
  /* --------------------- Close Update Popup ---------------------- */
  closeUpdatePopup() {
    this.stockL.emit(true);
    this.testValueBoolean = false;
    this.showUpdatePopUpChange.emit(!this.showUpdatePopUp);
    this.assignUpdatedData();
  }
  /* --------------------- Update Item ---------------------- */
  onSubmit(form) {
    // tslint:disable-next-line: no-unused-expression
    this.stoneFlage === true;
    if (this.stoneFlage === true) {
      console.log('New Stones Add');
    } else {
      this.newStoneArray = [];
    }
    this.updatedItemData = this.ItemDataCalculated;
    if (this.updatedItemData.stones.length === 0) {
      delete this.updatedItemData.stones;
    }
    this.api
      .put('products/' + this.updatedItemData.id, this.updatedItemData)
      .subscribe(value => {
        this.showUpdatePopUpChange.emit(!this.updatedStock);
        this.stockListPageReloadAfterUpdate.emit(true);
        this.toast.success(
          this.updatedItemData.label + ' ' + ' was successfully Updated',
          'Success!',
          {
            timeOut: 1000
          }
        );
        setTimeout(() => {
          location.reload();
        }, 1000);
      });
  }
  /* --------------------- Update Item ---------------------- */
  getServerData(event) {
    console.log(event);
  }
}
