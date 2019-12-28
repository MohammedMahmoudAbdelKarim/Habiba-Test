import { Component, ViewChild } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ModalDirective } from 'ngx-bootstrap';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { MainServiceService } from '../../shared-services/main-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { startWith, map } from 'rxjs/operators';

@Component({
  templateUrl: 'sales-list.component.html'
})
export class SalesListComponent {
  // Variables
  selection = new SelectionModel<any>(true, []);
  //  --------------------------------------   Tables Colums
  displayedColumns: string[] = [
    'select',
    'id',
    'product.label',
    'receipts.branch.name',
    'receipts.receipt_date',
    'receipts.receipt_number',
    'product.item_total_after_profit',
    'receipts.employee.name',
    'image',
    'actions'
  ];
  dataSource: MatTableDataSource<any> = new MatTableDataSource([]);
  // ----------------------------------------------- Boolean
  showDetailsPopup: boolean = false;
  showUpdataPopup: boolean = false;
  showDeletePopup: boolean = false;
  DeletingHold: boolean = false;
  deleteFlage: boolean = false;
  // ------------------------------------------------- Sort & Pagination
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('myModalPayment', { static: false })
  public myModalPayment: ModalDirective;
  @ViewChild('myModalImg', { static: false }) public myModalImg: ModalDirective;
  // ------------------------------------------------ Form Controls
  myControlBranch = new FormControl('');
  myControlInvoice = new FormControl('');
  myControlDate = new FormControl('');
  myControlStatus = new FormControl('');
  // ------------------------------------------------------ ASYNC
  filteredBranches: Observable<string[]>;
  filteredInvoices: Observable<string[]>;
  filteredDates: Observable<string[]>;
  filteredStatus: Observable<string[]>;
  // ----------------------------------------------- Arrays and Inital Variables
  hideme: any = [];
  products: any = [];
  statusList: any = [];
  pageNumbers: any = [];
  categoryList: any = [];
  productNumbersList: any = [];
  codeList: any;
  deletedStockIndex: any;
  tem_category: any = '';
  receipt_number: any = '';
  branch_id: any = '';
  status_id: any = '';
  branchList: any;
  deleteItem: any;
  receipt_date: any = '';
  data: any;
  invoiceValue: any = '';
  dateValue: any = '';
  stockData: any = '';
  branchValue: string = '';
  categoryValue: string = '';
  codeValue: string = '';
  checkedItems: any = 0;
  statusValue: string = '';
  imgUrl: string = 'img/products/';
  baseUrl: string = 'http://jewelry.ixscope.com/backend/img/products/';
  flage: boolean = false;
  modalError: any = [];
  transferName: any = '';
  transferCode: any = '';
  imgSrc: any = '';
  payment_id: any = '';
  payment_method: any = '1';

  // ---------------------------------------------- Form
  deleteForm = new FormGroup({
    deleteInput: new FormControl('')
  });
  selectNumberOfProductForm = new FormGroup({
    numberOfProducts: new FormControl('')
  });
  paymentForm = new FormGroup({
    paidAmount: new FormControl('', Validators.required)
  });
  page: any = '';
  per_page: number = 50;
  pageEvent: any;
  totalSearch: any = '';
  productTransferID: any;
  // Constructor
  constructor(
    private api: MainServiceService,
    private route: ActivatedRoute,
    private toast: ToastrService,
    private router: Router
  ) {
    this.route.data.subscribe(data => {
      console.log(data);
      // --------------------------------------  Get Branches
      this.branchList = data.branchList.data;
      // --------------------------------------- Get Sales
      this.products = data.receipts.data.data;
      this.data = Object.assign(data.receipts.data.data);
      console.log(data.receipts.data.data);

      this.dataSource = new MatTableDataSource(data.receipts.data.data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      // Sort item inside inner Object
      this.dataSource.sortingDataAccessor = (item, property) => {
        switch (property) {
          case 'product.label':
            return item.product.label;
          case 'receipts.branch.name':
            return item.receipts.branch.name;
          case 'receipts.employee.name':
            return item.receipts.employee.name;
          case 'receipts.receipt_number':
            return item.receipts.receipt_number;
          default:
            return item[property];
        }
      };
    });
    // Filter Branches
    this.filteredBranches = this.myControlBranch.valueChanges.pipe(
      startWith(''),
      map(value => this.filterBranch(value))
    );
    // Filter Invoices
    this.filteredInvoices = this.myControlInvoice.valueChanges.pipe(
      startWith(''),
      map(value => this.filterInvoice(value))
    );
    // Filter Dates
    this.filteredDates = this.myControlDate.valueChanges.pipe(
      startWith(''),
      map(value => this.fitlerDate(value))
    );
  }

  // Oninit
  // tslint:disable-next-line: use-lifecycle-interface
  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  // ----------------------------------------- Filter Branches
  private filterBranch(value) {
    // tslint:disable-next-line: triple-equals
    if (value == '' || value == undefined) {
      console.log(this.products);

      this.branch_id = '';
      // Send Request
      this.api
        .get('sales', {
          branch_id: this.branch_id,
          receipt_number: this.receipt_number,
          receipt_date: this.receipt_date,
          per_page: 50
        })
        // tslint:disable-next-line: no-shadowed-variable
        .subscribe(value => {
          console.log(value);
          setTimeout(() => {
            this.dataSource = new MatTableDataSource(value.data.data);
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
            // Sort item inside inner Object
            this.dataSource.sortingDataAccessor = (item, property) => {
              switch (property) {
                case 'product.label':
                  return item.product.label;
                case 'receipts.branch.name':
                  return item.receipts.branch.name;
                case 'receipts.employee.name':
                  return item.receipts.employee.name;
                case 'receipts.receipt_number':
                  return item.receipts.receipt_number;
                default:
                  return item[property];
              }
            };
          }, 300);
        });
    }
    // tslint:disable-next-line: triple-equals
    if (typeof value == 'object') {
      const filterValue = value.name.toLowerCase();
      this.branch_id = value.id;
      console.log(this.branch_id);
      // Send Request
      this.api
        .get('sales', {
          branch_id: this.branch_id,
          receipt_number: this.receipt_number,
          receipt_date: this.receipt_date,
          per_page: 50
        })
        // tslint:disable-next-line: no-shadowed-variable
        .subscribe(value => {
          console.log(value);
          setTimeout(() => {
            this.dataSource = new MatTableDataSource(value.data.data);
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
            // Sort item inside inner Object
            this.dataSource.sortingDataAccessor = (item, property) => {
              switch (property) {
                case 'product.label':
                  return item.product.label;
                case 'receipts.branch.name':
                  return item.receipts.branch.name;
                case 'receipts.employee.name':
                  return item.receipts.employee.name;
                case 'receipts.receipt_number':
                  return item.receipts.receipt_number;
                default:
                  return item[property];
              }
            };
          }, 300);
        });
      return this.branchList.filter(option =>
        option.name.toLowerCase().includes(filterValue)
      );
      // tslint:disable-next-line: triple-equals
    } else if (typeof value == 'string') {
      const filterValueName = value.toLowerCase();
      const info = this.products.filter(option =>
        option.receipts.branch.name.toLowerCase().includes(filterValueName)
      );
      console.log(info);
      this.dataSource = new MatTableDataSource(info);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      // Sort item inside inner Object
      this.dataSource.sortingDataAccessor = (item, property) => {
        switch (property) {
          case 'product.label':
            return item.product.label;
          case 'receipts.branch.name':
            return item.receipts.branch.name;
          case 'receipts.employee.name':
            return item.receipts.employee.name;
          case 'receipts.receipt_number':
            return item.receipts.receipt_number;
          default:
            return item[property];
        }
      };
      return this.branchList.filter(option =>
        option.name.toLowerCase().includes(filterValueName)
      );
    }
  }
  // ----------------------------------------- Display Branches
  displayBranch(branch): string {
    console.log(branch);
    return branch ? branch.name : branch;
  }
  // ----------------------------------------- Filter Invoices
  private filterInvoice(value) {
    // tslint:disable-next-line: triple-equals
    if (value == '' || value == undefined) {
      this.receipt_number = '';
      // Send Request
      this.api
        .get('sales', {
          branch_id: this.branch_id,
          receipt_number: this.receipt_number,
          receipt_date: this.receipt_date,
          per_page: 50
        })
        // tslint:disable-next-line: no-shadowed-variable
        .subscribe(value => {
          console.log(value);
          setTimeout(() => {
            this.dataSource = new MatTableDataSource(value.data.data);
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
            // Sort item inside inner Object
            this.dataSource.sortingDataAccessor = (item, property) => {
              switch (property) {
                case 'product.label':
                  return item.product.label;
                case 'receipts.branch.name':
                  return item.receipts.branch.name;
                case 'receipts.employee.name':
                  return item.receipts.employee.name;
                case 'receipts.receipt_number':
                  return item.receipts.receipt_number;
                default:
                  return item[property];
              }
            };
          }, 300);
        });
    }
    // tslint:disable-next-line: triple-equals
    if (typeof value == 'object') {
      const filterValue = value.receipts.receipt_number;
      this.receipt_number = value.receipts.receipt_number;
      console.log(this.receipt_number);
      // Send Request
      this.api
        .get('sales', {
          branch_id: this.branch_id,
          receipt_number: this.receipt_number,
          receipt_date: this.receipt_date,
          per_page: 50
        })
        // tslint:disable-next-line: no-shadowed-variable
        .subscribe(value => {
          console.log(value);
          setTimeout(() => {
            this.dataSource = new MatTableDataSource(value.data.data);
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
            // Sort item inside inner Object
            this.dataSource.sortingDataAccessor = (item, property) => {
              switch (property) {
                case 'product.label':
                  return item.product.label;
                case 'receipts.branch.name':
                  return item.receipts.branch.name;
                case 'receipts.employee.name':
                  return item.receipts.employee.name;
                case 'receipts.receipt_number':
                  return item.receipts.receipt_number;
                default:
                  return item[property];
              }
            };
          }, 300);
        });
      return this.products.filter(option =>
        option.receipts.receipt_number.includes(filterValue)
      );
      // tslint:disable-next-line: triple-equals
    } else if (typeof value == 'string') {
      // value = this.tem_category;
      const filterValueName = value;
      const info = this.products.filter(option =>
        option.receipts.receipt_number.includes(filterValueName)
      );
      console.log(info);
      this.dataSource = new MatTableDataSource(info);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      // Sort item inside inner Object
      this.dataSource.sortingDataAccessor = (item, property) => {
        switch (property) {
          case 'product.label':
            return item.product.label;
          case 'receipts.branch.name':
            return item.receipts.branch.name;
          case 'receipts.employee.name':
            return item.receipts.employee.name;
          case 'receipts.receipt_number':
            return item.receipts.receipt_number;
          default:
            return item[property];
        }
      };
      return this.products.filter(option =>
        option.receipts.receipt_number.includes(filterValueName)
      );
    }
  }
  // ----------------------------------------- Display Invoices
  displayInvoice(invoice): string {
    return invoice ? invoice.receipts.receipt_number : invoice;
  }
  // ----------------------------------------- Filter Dates
  private fitlerDate(value) {
    // tslint:disable-next-line: triple-equals
    if (value == '' || value == undefined) {
      this.receipt_date = '';
      // Send Request
      this.api
        .get('sales', {
          branch_id: this.branch_id,
          receipt_number: this.receipt_number,
          receipt_date: this.receipt_date,
          per_page: 50
        })
        // tslint:disable-next-line: no-shadowed-variable
        .subscribe(value => {
          console.log(value);
          setTimeout(() => {
            this.dataSource = new MatTableDataSource(value.data.data);
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
            // Sort item inside inner Object
            this.dataSource.sortingDataAccessor = (item, property) => {
              switch (property) {
                case 'product.label':
                  return item.product.label;
                case 'receipts.branch.name':
                  return item.receipts.branch.name;
                case 'receipts.employee.name':
                  return item.receipts.employee.name;
                case 'receipts.receipt_number':
                  return item.receipts.receipt_number;
                default:
                  return item[property];
              }
            };
          }, 300);
        });
    }
    // tslint:disable-next-line: triple-equals
    if (typeof value == 'object') {
      const filterValue = value.receipts.receipt_date;
      this.receipt_date = value.receipts.receipt_date;
      console.log(this.receipt_date);
      // Send Request
      this.api
        .get('sales', {
          branch_id: this.branch_id,
          receipt_number: this.receipt_number,
          receipt_date: this.receipt_date,
          per_page: 50
        })
        // tslint:disable-next-line: no-shadowed-variable
        .subscribe(value => {
          console.log(value);
          setTimeout(() => {
            this.dataSource = new MatTableDataSource(value.data.data);
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
            // Sort item inside inner Object
            this.dataSource.sortingDataAccessor = (item, property) => {
              switch (property) {
                case 'product.label':
                  return item.product.label;
                case 'receipts.branch.name':
                  return item.receipts.branch.name;
                case 'receipts.employee.name':
                  return item.receipts.employee.name;
                case 'receipts.receipt_number':
                  return item.receipts.receipt_number;
                default:
                  return item[property];
              }
            };
          }, 300);
        });
      return this.products.filter(option =>
        option.receipts.receipt_date.includes(filterValue)
      );
      // tslint:disable-next-line: triple-equals
    } else if (typeof value == 'string') {
      // value = this.tem_category;
      const filterValueName = value;
      const info = this.products.filter(option =>
        option.receipts.receipt_date.includes(filterValueName)
      );
      console.log(info);
      this.dataSource = new MatTableDataSource(info);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      // Sort item inside inner Object
      this.dataSource.sortingDataAccessor = (item, property) => {
        switch (property) {
          case 'product.label':
            return item.product.label;
          case 'receipts.branch.name':
            return item.receipts.branch.name;
          case 'receipts.employee.name':
            return item.receipts.employee.name;
          case 'receipts.receipt_number':
            return item.receipts.receipt_number;
          default:
            return item[property];
        }
      };
      return this.products.filter(option =>
        option.receipts.receipt_date.includes(filterValueName)
      );
    }
  }
  // ----------------------------------------- Display Codes
  displayDate(date): string {
    console.log(date);
    return date ? date.receipts.receipt_date : date;
  }

  /* -------------------------------- Checkbox---------------------------- */
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    if (this.isAllSelected()) {
      this.flage = false;
      this.selection.clear();
    } else {
      this.flage = true;
      this.checkedItems = this.selection.selected.length;
      this.dataSource.data.forEach(row => this.selection.select(row));
    }
    console.log(this.flage);
  }
  /** The receipt_date for the checkbox on the passed row */
  checkboxLabel(row?): string {
    this.checkedItems = this.selection.selected.length;
    if (!row) {
      this.flage = true;
      // console.log(this.flage);
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    } else {
      this.flage = false;
    }
    return `${
      this.selection.isSelected(row) ? 'deselect' : 'select'
    } row ${row.position + 1}`;
  }

  /* ------------------------------------ Popup ----------------------------- */
  openDetailsPopup(id) {
    console.log(id);

    this.showDetailsPopup = true;
  }
  openUpdataPopup(stockData, stockId) {
    this.stockData = stockData;
    console.log(stockData);
    this.showUpdataPopup = true;
  }
  closeUpdataPopup() {
    this.showUpdataPopup = false;
  }

  // Open Delete Popup
  opendeletePopup(row) {
    console.log(row);
    this.deleteItem = row;
    this.showDeletePopup = true;
    // this.DeletingHold = true;
  }

  // Close Delete Popup
  closeDeletePopup() {
    this.deleteForm.controls.deleteInput.setValue('');
    this.showDeletePopup = false;
  }

  getPaymentType(event) {
    console.log(event);
    this.payment_method = event;
  }

  openPayment(row) {
    console.log(row.receipt_number);
    this.payment_id = row.id;
  }
  onSubmitPayment(form) {
    console.log(form.value);
    console.log(this.payment_id);
    this.api
      .post('receipts/' + this.payment_id + '/pay', {
        payment_amount: form.value.paidAmount,
        payment_method: this.payment_method
      })
      .subscribe(value => {
        console.log(value);
        if (value.status == 'success') {
          this.myModalPayment.hide();
          this.toast.success('Thank You' + '!Success');
          this.api.get('receipts', { per_page: 50 }).subscribe(data => {
            console.log(data);

            this.dataSource = new MatTableDataSource(data.data.data);
            // console.log(data.sales.data.last_page);
            // console.log(this.pageNumbers);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            // Sort item inside inner Object
            this.dataSource.sortingDataAccessor = (item, property) => {
              switch (property) {
                case 'products[0].label':
                  return item.products[0].label;
                case 'branch.name':
                  return item.branch.name;
                case 'status.name':
                  return item.status.name;
                default:
                  return item[property];
              }
            };
          });
        }
      });
  }

  reloadPage() {
    console.log('Reload');
  }
  // --------------------------- Pagniation & Number of items showed in the page
  onPaginateChange(event) {
    console.log(event.pageSize);
    this.api
      .get('receipts', {
        per_page: event.pageSize
      })
      .subscribe((productList: any) => {
        console.log(productList.data.data);
        this.products = productList.data.data;
        this.dataSource = new MatTableDataSource(productList.data.data);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sortingDataAccessor = (item, property) => {
          switch (property) {
            case 'category.name':
              return item.category.name;
            case 'branch.name':
              return item.branch.name;
            case 'status.name':
              return item.status.name;
            default:
              return item[property];
          }
        };
      });
  }

  // Open Image Modal
  openImage(event) {
    this.myModalImg.show();
    console.log(event.src);
    this.imgSrc = event.src;
  }

  // Transfer Action
  onSubmitTransfer(form) {
    console.log(form.value);
    console.log(this.productTransferID);

    this.api
      .put('branches/' + form.value.branch_id + '/transfer', {
        product_id: this.productTransferID
      })
      .subscribe(val => {
        console.log(val);
        this.toast.success(
          'The product has been successfully transfered',
          '!Success'
        );
        this.api
          .get('receipts', {
            branch_id: this.branch_id,
            receipt_number: this.receipt_number,
            receipt_date: this.receipt_date,
            status_id: this.status_id,
            per_page: 50
          })
          // tslint:disable-next-line: no-shadowed-variable
          .subscribe(value => {
            console.log(value);
            this.dataSource = new MatTableDataSource(value.data.data);
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
            // Sort item inside inner Object
            this.dataSource.sortingDataAccessor = (item, property) => {
              switch (property) {
                case 'product.label':
                  return item.product.label;
                case 'receipts.branch.name':
                  return item.receipts.branch.name;
                case 'receipts.employee.name':
                  return item.receipts.employee.name;
                case 'receipts.receipt_number':
                  return item.receipts.receipt_number;
                default:
                  return item[property];
              }
            };
          });
        // this.myModal.hide();
      });
  }

  // Transfer Data Show
  getData(row) {
    console.log(row);
    this.productTransferID = row.id;
    this.transferName = row.branch.name;
    this.transferCode = row.label;
  }

  // Invoice Action
  routeToSale(row) {
    console.log(row);
    this.router.navigate(['/sales/make-new-sale'], {
      queryParams: { id: row.id },
      skipLocationChange: true
    });
  }
}
