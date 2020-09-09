import { MainServiceService } from './../../shared-services/main-service.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ModalDirective } from 'ngx-bootstrap/modal';
@Component({
  templateUrl: 'make-new-sale.component.html'
})
export class MakeNewSaleComponent implements OnInit {
  /* ----------------------------------- Variables ------------------------ */
  // Modals
  @ViewChild('myModalBranch', { static: false })
  public myModalBranch: ModalDirective;
  @ViewChild('myModalClient', { static: false })
  public myModalClient: ModalDirective;
  // Boolean
  filter: boolean = false;
  emptyArr: boolean = false;
  clientData: boolean = false;
  isInvoiced: boolean = false;
  productData: boolean = false;
  addDisAbledState: boolean = true;
  productDataValidatiuonError = false;
  filterSerchingHold: boolean = false;
  branchesListListValueChange: boolean = false;
  checkItemDataCalculatedIsDefiend: boolean = false;
  // Arrays and Inital Variables
  modalError: any = [];
  errMessage: any = [];
  branchesList: any = [];
  productArray: any = [];
  clientsArray: any = [];
  citiesListArray: any = [];
  sellingProductListArray: any = [];
  sellingProductStonesTotalsArray: any = [];
  entryDate: any;
  totlaInEGP: any;
  dollarPrice: any;
  sentProductDate: any;
  sentFormBranchId: any;
  filteredCodeData: any;
  selectedBranchId: any;
  filteredClientsData: any;
  selectedProductData: any;
  selectedClientId: any;
  label: any = '';
  codeValue: any = '';
  branchName: any = '';
  clientValue: any = '';
  remainingPrice: any = '';
  branch_name: any = '';
  invoiceTotal: any = 0;
  stoneTotalAfterChang: any = '';
  payment_method: any = 1;
  productID: any = '';
  // ASYNC
  filteredClients: Observable<string[]>;
  filterCodes: Observable<string[]>;
  // Form Controls
  clientNameData = new FormControl('');
  filterCode = new FormControl('');
  /* ----------------------------------- Form ------------------------ */
  // Product Form
  productSelectForm = new FormGroup({
    filterCode: new FormControl('')
  });
  // Invoice Form
  invoiceDataform = new FormGroup({
    clientNameData: new FormControl('', Validators.required),
    date: new FormControl('', Validators.required),
    branch: new FormControl('', Validators.required)
  });
  // Edit Product Stone Form
  editProductStoneForm = new FormGroup({
    productStonePrice: new FormControl(''),
    productStoneSetting: new FormControl(''),
    productStoneQuantity: new FormControl(''),
    productStoneWeight: new FormControl(''),
    productColor: new FormControl(''),
    productClarity: new FormControl('')
  });
  // Paid Amount Form
  paidAmountForm = new FormGroup({
    paidAmount: new FormControl('0'),
    total_egp: new FormControl('')
  });
  // Branch Form
  branchesForm = new FormGroup({
    name: new FormControl('', Validators.required),
    address: new FormControl('', Validators.required),
    city_id: new FormControl('', Validators.required)
  });
  // Client Form
  clientsForm = new FormGroup({
    name: new FormControl('', Validators.required),
    mobile: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required)
  });
  client_name: any;
  reseller_id: any;
  reseller_name: any;
  /* ----------------------------------- Constructor ------------------------ */
  constructor(
    private api: MainServiceService,
    private route: ActivatedRoute,
    private toast: ToastrService,
    private router: Router
  ) {
    this.route.queryParams.subscribe(value => {
      if (value) {
        this.api.get('products/' + value.id).subscribe(val => {
          if (val.data) {
            this.isInvoiced = true;
            this.branch_name = val.data.branch.name;
            if (val.data.reseller) {
              this.reseller_name = val.data.reseller.client.name;
              this.client_name = val.data.reseller.client.name;
              this.selectedClientId = val.data.reseller.client.id;
              this.reseller_id = val.data.reseller.client.id;
            }
            this.sellingProductListArray.push(val.data);
            this.sentFormBranchId = val.data.branch.id;
            this.sellingProductListArray.forEach(value => {
              this.invoiceTotal += Math.ceil(value.item_total_after_profit);
            });
          } else {
            this.sellingProductListArray = [];
          }
        });
      }
    });
    this.route.data.subscribe(data => {
      // Get Cities
      this.citiesListArray = data.cities.data;
      // Get Clients
      this.clientsArray = data.clients;
      // Get Branches
      this.branchesList = data.branchList.data;
      this.sentFormBranchId = data.branchList.data[0].id;
      this.branchName = data.branchList.data[0].name;
    });
    // Filter Clients
    this.filteredClients = this.clientNameData.valueChanges.pipe(
      startWith(''),
      map(value => this.filterClients(value))
    );
    // Filter Codes
    this.filterCodes = this.filterCode.valueChanges.pipe(
      startWith(''),
      map(value => this.fitlerCode(value))
    );
  }
  /* ----------------------------------- OnInit ------------------------ */
  ngOnInit() {
    this.getSettingsApiData();
  }
  /* ----------------------------------- Get Data ------------------------ */
  getSettingsApiData() {
    this.api.get('settings', {}).subscribe(
      (settings: any) => {
        this.dollarPrice = Number(settings.data[0].dollar_price);
      },
      error => {
        console.log('Error in Getting Data');
      }
    );
  }
  clearError() {
    this.modalError = [];
  }
  /* ------------------------------- Get Payment Method --------------------- */
  getPaymentType(event) {
    this.payment_method = Number(event);
  }
  /* ------------------------------- Clear Code Search --------------------- */
  clearSearch() {
    this.codeValue = '';
    this.addDisAbledState = true;
    this.api
      .get('products/active', {
        label: this.label,
        branch_id: this.sentFormBranchId
      })
      //     // tslint:disable-next-line: no-shadowed-variable
      .subscribe(val => {
        this.productArray = val.data;
        if (val.data.length) {
          this.selectedProductData = [];
          this.selectedProductData = val.data;
          this.filterSerchingHold = false;
          this.addDisAbledState = false;
          this.emptyArr = false;
        } else {
          this.addDisAbledState = true;
          this.emptyArr = true;
        }
      });
  }
  /* ---------------------------- Filter Codes ------------------------ */
  private fitlerCode(value) {
    // tslint:disable-next-line: triple-equals
    if (value == '' || value == undefined) {
      this.label = '';
      this.api
        .get('products/active', {
          label: this.label,
          branch_id: this.sentFormBranchId
        })
        //     // tslint:disable-next-line: no-shadowed-variable
        .subscribe(val => {
          if (val['data']) {
            this.productArray = val.data;
            if (val.data.length) {
              this.selectedProductData = [];
              this.selectedProductData = val.data;
              this.filterSerchingHold = false;
              this.addDisAbledState = true;
              this.emptyArr = false;
            } else {
              this.addDisAbledState = false;
              this.emptyArr = true;
              this.productArray = [];
            }
          }
        });
      return this.productArray.filter(option => {
        option.label.toLowerCase();
      });
    }
    // tslint:disable-next-line: triple-equals
    if (typeof value == 'object') {
      const filterValue = value.label.toLowerCase();
      this.label = value.label;
      this.api
        .get('products/' + value.id, {})
        //     // tslint:disable-next-line: no-shadowed-variable
        .subscribe(val => {
          this.productArray = [];
          this.selectedProductData = [];
          this.productArray.push(val.data);
          this.selectedProductData.push(val.data);
          if (val) {
            this.selectedProductData = [];
            this.selectedProductData.push(val.data);
            this.filterSerchingHold = false;
            this.addDisAbledState = false;
            this.emptyArr = false;
          } else {
            this.addDisAbledState = true;
            this.emptyArr = true;
          }
        });
      return this.productArray.filter(option =>
        option.label.toLowerCase().includes(filterValue)
      );
      //   // tslint:disable-next-line: triple-equals
    } else if (typeof value == 'string') {
      const filterValueName = value.toLowerCase().trim();
      this.api
        .get('products/active', {
          label: value,
          branch_id: this.sentFormBranchId
        })
        // tslint:disable-next-line: no-shadowed-variable
        .subscribe(val => {
          if (val['data']) {
            this.productArray = val.data;
            if (val.data.length) {
              this.filterSerchingHold = false;
              this.addDisAbledState = true;
            } else {
              this.addDisAbledState = false;
              this.emptyArr = true;
            }
          } else {
            this.productArray = [];
          }
        });
      return this.productArray.filter(option => {
        if (option.label.toLowerCase().includes(filterValueName)) {
          this.emptyArr = false;
          return option.label.toLowerCase().includes(filterValueName);
        } else {
          this.emptyArr = true;
        }
      });
    }
  }
  /* ---------------------------- Display Codes ------------------------ */
  displayCode(code): string {
    return code ? code.label : code;
  }
  /* ---------------------------- Filter Clients ------------------------ */
  private filterClients(value) {
    // tslint:disable-next-line: triple-equals
    if (typeof value == 'object') {
      const filterValue = value.name.toLowerCase();
      const filterNumber = value.mobile;
      return this.clientsArray.filter(
        option =>
          option.name.toLowerCase().includes(filterValue) ||
          option.mobile.includes(filterNumber)
      );
      // tslint:disable-next-line: triple-equals
    } else if (typeof value == 'string') {
      const filterValueName = value.toLowerCase();
      const filterNumber = value;
      return this.clientsArray.filter(
        option =>
          option.name.toLowerCase().includes(filterValueName) ||
          option.mobile.includes(filterNumber)
      );
    }
  }
  /* ---------------------------- Display Clients ------------------------ */
  displayClient(client): string {
    this.selectedClientId = client.id;
    return client ? client.name : client;
  }
  /* ---------------------------- Get Client ID ------------------------ */
  getClientId(event) {
    this.selectedClientId = event.id;
  }
  /* ---------------------------- Calculating Sum ------------------------ */
  calculateStoneTotal(e, stoneIndex, sellingProductIndex, key) {
    this.checkItemDataCalculatedIsDefiend = true;
    if (key === 'sP') {
      this.sellingProductListArray[sellingProductIndex].stones[
        stoneIndex
      ].price = this.editProductStoneForm.value.productStonePrice;
    }
    if (key === 'sS') {
      this.sellingProductListArray[sellingProductIndex].stones[
        stoneIndex
      ].setting = this.editProductStoneForm.value.productStoneSetting;
    }
    if (key === 'sQ') {
      this.sellingProductListArray[sellingProductIndex].stones[
        stoneIndex
      ].quantity = this.editProductStoneForm.value.productStoneQuantity;
    }
    if (key === 'sW') {
      this.sellingProductListArray[sellingProductIndex].stones[
        stoneIndex
      ].weight = this.editProductStoneForm.value.productStoneWeight;
    }
    if (key === 'Color') {
      this.sellingProductListArray[sellingProductIndex].stones[
        stoneIndex
      ].color = this.editProductStoneForm.value.productColor;
    }
    if (key === 'Clarity') {
      this.sellingProductListArray[sellingProductIndex].stones[
        stoneIndex
      ].clarity = this.editProductStoneForm.value.productClarity;
    }
    this.sellingProductListArray[sellingProductIndex].stones[
      stoneIndex
    ].total = +(
      this.sellingProductListArray[sellingProductIndex].stones[stoneIndex]
        .price *
        this.sellingProductListArray[sellingProductIndex].stones[stoneIndex]
          .weight +
      this.sellingProductListArray[sellingProductIndex].stones[stoneIndex]
        .setting *
        this.sellingProductListArray[sellingProductIndex].stones[stoneIndex]
          .quantity
    ).toFixed(2);
    //  Display New Stone Total After Stone Values Changing
    this.sellingProductStonesTotalsArray[
      stoneIndex
    ] = this.sellingProductListArray[sellingProductIndex].stones[
      stoneIndex
    ].total;
    const itemStones = this.sellingProductListArray[sellingProductIndex].stones; // Create Array To Stone Items
    let stoneTotalsSum = null; // Place To Stone The Total Cost
    itemStones.forEach(value => {
      stoneTotalsSum += value.total;
    });

    this.sellingProductListArray[
      sellingProductIndex
    ].item_total_after_profit = Math.ceil(
      (stoneTotalsSum +
        this.sellingProductListArray[sellingProductIndex].gold_price *
          this.sellingProductListArray[sellingProductIndex].gold_weight) *
        this.sellingProductListArray[sellingProductIndex].profit_percent
    );
    this.invoiceTotal = this.sellingProductListArray[
      sellingProductIndex
    ].item_total_after_profit;

    // Create Array To Stone Items // Place To Stone The Total Cost
    // this.sellingProductListArray.forEach(value => {
    //   // this.invoiceTotal += value.item_total_after_profit;
    // });
  }
  /* ---------------------------- Number Validation ------------------------ */
  numberCheckValidation(e) {
    if ((48 <= e.keyCode && e.keyCode <= 57) || e.keyCode === 46) {
    } else {
      return false;
    }
  }
  /* ---------------------------- Create New Branch ------------------------ */
  onSubmitBranch(form) {
    this.api.post('branches', form.value).subscribe(
      value => {
        // tslint:disable-next-line: no-shadowed-variable
        this.api.get('branches/active').subscribe(value => {
          this.branchesList = value.data;
        });
        this.toast.success(
          form.value.name + ' ' + ' has been successfully Created',
          'Success!',
          {
            timeOut: 1000
          }
        );
        this.myModalBranch.hide();
      },
      error => {
        if (error.error.errors) {
          this.toast.error(error.error.errors, '!Error');
        } else {
          this.toast.error(error.error.message, '!Error');
        }
      }
    );
  }
  /* ---------------------------- Create New Client ------------------------ */
  onSubmitClient(form) {
    this.api.post('clients', form.value).subscribe(
      value => {
        // tslint:disable-next-line: no-shadowed-variable
        this.api.get('clients/active').subscribe(value => {
          this.clientsArray = value;
        });
        this.toast.success(
          form.value.name + ' ' + ' has been successfully Created',
          'Success!',
          {
            timeOut: 1000
          }
        );
        this.myModalClient.hide();
      },
      error => {
        if (error.error.errors) {
          this.toast.error(error.error.errors, '!Error');
        } else {
          this.toast.error(error.error.message, '!Error');
        }
        this.api.fireAlert('error', 'Please Fill All Data', '');
      }
    );
  }
  /* ---------------------------- Get Warehouse ------------------------ */
  getSelectedListOptionId(event) {
    this.sentFormBranchId = event.value;
    this.branchesListListValueChange = true;
    const branchSelectedName = this.branchName;
    for (const branch of this.branchesList) {
      if (branchSelectedName === branch.name) {
        this.sentFormBranchId = event.value;
        this.api
          .get('products/active', {
            label: this.label,
            branch_id: Number(event.value)
          })
          // tslint:disable-next-line: no-shadowed-variable
          .subscribe(value => {
            this.productArray = [];
            this.productArray = value.data;
            if (value.data.length) {
              this.productArray = value.data;
              this.filterSerchingHold = false;
              this.addDisAbledState = true;
            } else {
              this.addDisAbledState = false;
            }
          });
      }
    }
  }
  /* ---------------------------- Data Format Change ------------------------ */
  entryDateChanged(event, type) {
    let entryDateArray;
    entryDateArray = event.targetElement.value.split('/');
    this.entryDate =
      entryDateArray[1] + '/' + entryDateArray[0] + '/' + entryDateArray[2];
    this.sentProductDate =
      entryDateArray[2] + '/' + entryDateArray[0] + '/' + entryDateArray[1];
  }
  /* --------------------------- Display Sales Items ------------------------ */
  selectProduct(event, index) {
    this.addDisAbledState = false;
  }
  /* ----------------- SUM TOTAL PRICE OF SINGLE PRODUCT -------------------- */
  sumTotalOFSingleProduct(addedProduct) {
    console.log(
      'Selected Product Data >> Here In Sum Total Of Single Product  >>',
      addedProduct
    );
  }
  /* ----------------- Push Item To Array -------------------- */
  addItemTosellingProductListArray() {
    this.sellingProductListArray.push(...this.selectedProductData);
    this.sumTotalOFSingleProduct(this.selectedProductData);
    this.invoiceTotal = 0;
    this.sellingProductListArray.forEach(value => {
      this.invoiceTotal += Math.ceil(value.item_total_after_profit);
    });
    this.clearSearch();
    this.paidAmountForm.controls.total_egp.setValue(
      this.invoiceTotal * this.dollarPrice
    );
  }
  /* ----------------- Calculate Remaining Amout -------------------- */
  calculateRemaining() {
    this.remainingPrice =
      this.paidAmountForm.controls.total_egp.value -
      this.paidAmountForm.controls.paidAmount.value;
    if (this.remainingPrice <= 0) {
      this.remainingPrice = 0;
    }
  }
  /* ----------------- Remove Item from Array -------------------- */
  removeItem(e, stoneIndex, sellingProductIndex, key) {
    if (sellingProductIndex == undefined) {
      sellingProductIndex = 0;
    }
    this.sellingProductListArray.splice(sellingProductIndex, 1);
    this.invoiceTotal = 0;
    this.sellingProductListArray.forEach(value => {
      this.invoiceTotal -= Math.ceil(value.item_total_after_profit);
    });
    this.invoiceTotal = Math.abs(this.invoiceTotal);
  }
  /* ----------------- Create New Sale -------------------- */
  onSubmit() {
    let arr = this.sellingProductListArray.slice(0);
    if (this.paidAmountForm.value.paidAmount === '') {
      this.paidAmountForm.value.paidAmount = 0;
    }

    if (this.paidAmountForm.value.total_egp == '') {
      this.paidAmountForm.controls.total_egp.setValue(
        this.invoiceTotal * this.dollarPrice
      );
    }
    this.api
      .post('receipts', {
        items: arr,
        reseller_id: this.reseller_id,
        client_id: this.selectedClientId,
        branch_id: this.sentFormBranchId,
        receipt_date: this.sentProductDate,
        dollar_price: this.dollarPrice,
        total_dollar: this.invoiceTotal,
        paid_egp: this.paidAmountForm.value.paidAmount,
        total_egp: this.paidAmountForm.value.total_egp,
        payment_method: this.payment_method
      })
      .subscribe(
        value => {
          this.errMessage = [];
          if (value.status == 'success') {
            this.router.navigateByUrl('/main-stock/stock-list');
            this.toast.success(
              'Sale has been successfully Created',
              'Success!',
              {
                timeOut: 1000
              }
            );
          }
        },
        error => {
          if (error.error.errors) {
            this.toast.error(error.error.errors, '!Error');
          } else {
            this.toast.error(error.error.message, '!Error');
          }
          this.api.fireAlert('error', 'Please Fill All Data', '');
        }
      );
  }
  /*--------------------------------- Logout ------------------------------ */
  logout() {
    sessionStorage.removeItem('token');
    this.router.navigate(['/']);
  }
}
