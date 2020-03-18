import { MainServiceService } from './../../shared-services/main-service.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { fromEvent, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ModalDirective } from 'ngx-bootstrap';
@Component({
  templateUrl: 'return.component.html'
})
export class ReturnComponent implements OnInit {
  /* ----------------------------------- Variables ------------------------ */
  // Modals
  @ViewChild('myModalBranch', { static: false })
  public myModalBranch: ModalDirective;
  @ViewChild('myModalClient', { static: false })
  public myModalClient: ModalDirective;
  // Boolean
  filterSerchingHold: boolean = false;
  filter: boolean = false;
  branchesListListValueChange: boolean = false;
  addDisAbledState: boolean = true;
  productDataValidatiuonError = false;
  checkItemDataCalculatedIsDefiend: boolean = false;
  emptyArr: boolean = false;
  isInvoiced: boolean = false;
  // Arrays and Inital Variables
  productArray: any = [];
  clientsArray: any = [];
  branchesList: any = [];
  citiesListArray: any = [];
  errMessage: any = [];
  modalError: any = [];
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
  stoneTotalAfterChang: any = '';
  label: any = '';
  codeValue: any = '';
  branchName: any = '';
  clientValue: any = '';
  remainingPrice: any = '';
  branch_name: any = '';
  payment_method: any = 1;
  invoiceTotal: any = '';
  invoiceDollarTotal: any = '';
  invoiceNumber: any = '';
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
    productStoneSetting: new FormControl('')
  });
  // Paid Amount Form
  paidAmountForm = new FormGroup({
    paidAmount: new FormControl(''),
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
  clientName: any = '';
  /* ----------------------------------- Constructor ------------------------ */
  constructor(
    private api: MainServiceService,
    private route: ActivatedRoute,
    private toast: ToastrService,
    private router: Router
  ) {
    this.route.queryParams.subscribe(value => {
      console.log(value);
      this.api.get('products/' + value.id).subscribe(val => {
        console.log(val.data);
        if (val.data) {
          this.isInvoiced = true;
          this.clientName = val.data.receipt.receipts.client.name;
          this.branch_name = val.data.branch.name;
          this.sellingProductListArray.push(val.data);
          this.sentFormBranchId = val.data.branch.id;
          this.sellingProductListArray.forEach(value => {
            this.invoiceTotal = Math.ceil(value.receipt.receipts.total_egp);
            this.invoiceDollarTotal = Math.ceil(
              value.receipt.receipts.total_dollar
            );
          });
        } else {
          this.sellingProductListArray = [];
          this.isInvoiced = false;
        }
      });
    });
    this.route.data.subscribe(data => {
      // Get Cities
      this.citiesListArray = data.cities.data;
      // Get Clients
      this.clientsArray = data.clients;
      // Get Branches
      this.branchesList = data.branchList.data;
      this.sentFormBranchId = data.branchList.data[0].id;
      this.api
        .get('products/sold', {
          label: this.label,
          branch_id: data.branchList.data[0].id
        })
        // tslint:disable-next-line: no-shadowed-variable
        .subscribe(val => {
          this.productArray = val.data;
          if (val.data.length) {
            this.selectedProductData = val.data;
            console.log(val.data);

            // this.clientName = val.data[0].client.name;
            // console.log(this.clientName);

            this.filterSerchingHold = false;
            this.emptyArr = false;
          } else {
            this.addDisAbledState = true;
            this.emptyArr = true;
          }
        });
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
        console.log('Error In Getting Data');
      }
    );
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
      .get('products/sold', {
        label: this.label,
        branch_id: this.sentFormBranchId
      })
      // tslint:disable-next-line: no-shadowed-variable
      .subscribe(val => {
        this.productArray = val.data;
        if (val.data.length) {
          this.selectedProductData = val.data;
          this.filterSerchingHold = false;
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
      this.addDisAbledState = true;
      this.api
        .get('products/sold', {
          label: this.label,
          branch_id: this.sentFormBranchId
        })
        // tslint:disable-next-line: no-shadowed-variable
        .subscribe(val => {
          this.productArray = val.data;
          if (val.data.length) {
            this.selectedProductData = val.data;
            this.filterSerchingHold = false;
            this.emptyArr = false;
          } else {
            this.addDisAbledState = true;
            this.emptyArr = true;
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
        .get('products/sold', {
          label: this.label,
          branch_id: this.sentFormBranchId
        })
        // tslint:disable-next-line: no-shadowed-variable
        .subscribe(val => {
          console.log(val.data[0].receipt.receipts.client.name);
          this.clientName = val.data[0].receipt.receipts.client.name;
          this.productArray = val.data;
          if (val.data.length) {
            this.selectedProductData = val.data;
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
      // tslint:disable-next-line: triple-equals
    } else if (typeof value == 'string') {
      const filterValueName = value.toLowerCase().trim();
      this.api
        .get('products/sold', {
          label: this.label,
          branch_id: this.sentFormBranchId
        })
        // tslint:disable-next-line: no-shadowed-variable
        .subscribe(val => {
          this.productArray = val.data;
          if (val.data.length) {
            this.filterSerchingHold = false;
            this.addDisAbledState = true;
          } else {
            this.addDisAbledState = true;
            this.emptyArr = true;
          }
        });
      return this.productArray.filter(option => {
        if (option.label.toLowerCase().includes(filterValueName)) {
          this.emptyArr = false;
          return option.label.toLowerCase().includes(filterValueName);
        } else {
          this.emptyArr = true;
          this.addDisAbledState = true;
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
    this.sellingProductListArray[sellingProductIndex].stones[
      stoneIndex
    ].total = Math.ceil(
      this.sellingProductListArray[sellingProductIndex].stones[stoneIndex]
        .price *
        this.sellingProductListArray[sellingProductIndex].stones[stoneIndex]
          .weight +
        this.sellingProductListArray[sellingProductIndex].stones[stoneIndex]
          .setting *
          this.sellingProductListArray[sellingProductIndex].stones[stoneIndex]
            .quantity
    );
    //  Display New Stone Total After Stone Values Changing
    this.sellingProductStonesTotalsArray[
      stoneIndex
    ] = this.sellingProductListArray[sellingProductIndex].stones[
      stoneIndex
    ].total;
    const itemStones = this.sellingProductListArray[sellingProductIndex].stones; // Create Array To Stone Items
    let stoneTotalsSum = null; // Place To Stone the Total Cost
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
    // Create Array To Stone Items // Place To Stone The Total Cost
    this.invoiceTotal = 0;
    this.sellingProductListArray.forEach(value => {
      this.invoiceTotal = Math.ceil(value.receipt.receipts.total_egp);
      this.invoiceDollarTotal = Math.ceil(value.receipt.receipts.total_dollar);
    });
  }
  /* ---------------------------- Number Validation ------------------------ */
  numberCheckValidation(e) {
    if ((48 <= e.keyCode && e.keyCode <= 57) || e.keyCode === 46) {
    } else {
      return false;
    }
  }
  /* -------------------------- Create New Branch ------------------------ */
  onSubmitBranch(form) {
    this.api.post('branches', form.value).subscribe(
      value => {
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
        this.modalError = error.error.errors;
        this.api.fireAlert('error', 'Please Fill All Data', '');
      }
    );
  }
  /* ---------------------------- Create New Client ------------------------ */
  onSubmitClient(form) {
    this.api.post('clients', form.value).subscribe(
      value => {
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
        this.modalError = error.error.errors;
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
          .get('products/sold', {
            label: this.label,
            branch_id: Number(event.value)
          })
          // tslint:disable-next-line: no-shadowed-variable
          .subscribe(value => {
            this.productArray = value.data;
            if (value.data.length) {
              this.productArray = value.data;
              this.filterSerchingHold = false;
            } else {
              this.addDisAbledState = true;
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
      this.invoiceTotal = Math.ceil(value.receipt.receipts.total_egp);
      this.invoiceDollarTotal = Math.ceil(value.receipt.receipts.total_dollar);
    });
    this.clearSearch();
  }
  /* ----------------- Calculate Remaining Amout -------------------- */
  calculateRemaining(event) {
    this.remainingPrice = this.invoiceTotal * this.dollarPrice - event.value;
  }
  /* ----------------- Remove Item from Array -------------------- */
  removeItem(e, stoneIndex, sellingProductIndex, key) {
    if (sellingProductIndex == undefined) {
      sellingProductIndex = 0;
    }
    this.sellingProductListArray.splice(sellingProductIndex, 1);
    this.invoiceTotal = 0;
    this.sellingProductListArray.forEach(value => {
      this.invoiceTotal = Math.ceil(value.receipt.receipts.total_egp);
      this.invoiceDollarTotal = Math.ceil(value.receipt.receipts.total_dollar);
    });
    this.invoiceTotal = Math.abs(this.invoiceTotal);
  }
  /* ----------------- Create New Sale -------------------- */
  onSubmit() {
    const arr = this.sellingProductListArray.slice(0);
    if (this.paidAmountForm.value.paidAmount === '') {
      this.paidAmountForm.value.paidAmount = 0;
    }
    this.api
      .post('refund', {
        items: arr,
        product_id: arr[0].id,
        branch_id: this.sentFormBranchId,
        receipt_date: this.sentProductDate,
        dollar_price: this.dollarPrice,
        total_dollar: this.invoiceDollarTotal,
        paid_egp: this.paidAmountForm.value.paidAmount,
        total_egp: this.invoiceTotal,
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
          this.errMessage = error.error.errors;
          let errorAlert = error.error.message;
          this.api.fireAlert('error', errorAlert, '');
        }
      );
  }
  /*--------------------------------- Logout ------------------------------ */
  logout() {
    sessionStorage.removeItem('token');
    this.router.navigate(['/']);
  }
}
