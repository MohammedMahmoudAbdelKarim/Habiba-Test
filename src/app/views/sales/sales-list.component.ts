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
  @ViewChild('detailsModal', { static: false })
  public detailsModal: ModalDirective;
  selection = new SelectionModel<any>(true, []);
  //  --------------------------------------   Tables Colums
  displayedColumns: string[] = [
    'select',
    'id',
    'product.label',
    'receipts.branch.name',
    'receipts.receipt_date',
    'product.metal.name',
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
  // ------------------------------------------------ Form Controls
  myControlBranch = new FormControl('');
  myControlInvoice = new FormControl('');
  myControlDate = new FormControl('');
  myControlMetal = new FormControl('');
  // ------------------------------------------------------ ASYNC
  filteredBranches: Observable<string[]>;
  filteredInvoices: Observable<string[]>;
  filteredDates: Observable<string[]>;
  filteredMetals: Observable<string[]>;
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
  metalValue: any = '';
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
  metals: any = [];
  page: any = '';
  per_page: number = 50;
  pageEvent: any;
  totalSearch: any = '';
  productTransferID: any;
  metal_type: any = '';
  entryDate: any = '';
  fromDate: any = '';
  toDate: any = '';

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
      // --------------------------------------  Get Metals
      this.metals = data.metal.data;
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
          case 'product.metal.name':
            return item.product.metal.name;
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
    this.filteredMetals = this.myControlMetal.valueChanges.pipe(
      startWith(''),
      map(value => this.filterMetal(value))
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
          metal_type: this.metal_type,
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
                case 'product.metal.name':
                  return item.product.metal.name;
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
          metal_type: this.metal_type,
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
                case 'product.metal.name':
                  return item.product.metal.name;
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
          case 'product.metal.name':
            return item.product.metal.name;
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
          metal_type: this.metal_type,
          from_date: this.fromDate,
          to_date: this.toDate,
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
                case 'product.metal.name':
                  return item.product.metal.name;
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
          metal_type: this.metal_type,
          from_date: this.fromDate,
          to_date: this.toDate,
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
                case 'product.metal.name':
                  return item.product.metal.name;
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
          case 'product.metal.name':
            return item.product.metal.name;
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
  /* ---------------------------- Data Format Change ------------------------ */
  // 1
  entryDateFrom(event, type) {
    if (event.targetElement.value) {
      this.api
        .get('sales', {
          branch_id: this.branch_id,
          receipt_number: this.receipt_number,
          metal_type: this.metal_type,
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
                case 'client.name':
                  return item.client.name;
                default:
                  return item[property];
              }
            };
          }, 300);
        });
    }
    let entryDateArray;
    entryDateArray = event.targetElement.value.split('/');
    this.entryDate =
      entryDateArray[1] + '/' + entryDateArray[0] + '/' + entryDateArray[2];
    this.fromDate =
      entryDateArray[2] + '/' + entryDateArray[0] + '/' + entryDateArray[1];
    this.api
      .get('sales', {
        branch_id: this.branch_id,
        receipt_number: this.receipt_number,
        metal_type: this.metal_type,
        from_date: this.fromDate,
        to_date: this.toDate,
        per_page: 50
      })
      // tslint:disable-next-line: no-shadowed-variable
      .subscribe(value => {
        setTimeout(() => {
          this.dataSource = new MatTableDataSource(value.data.data);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
          // Sort item inside inner Object
          this.dataSource.sortingDataAccessor = (item, property) => {
            switch (property) {
              case 'client.name':
                return item.client.name;
              default:
                return item[property];
            }
          };
        }, 300);
      });
  }
  // 2
  entryDateTo(event, type) {
    if (event.targetElement.value) {
      this.api
        .get('sales', {
          branch_id: this.branch_id,
          receipt_number: this.receipt_number,
          metal_type: this.metal_type,
          per_page: 50
        })
        // tslint:disable-next-line: no-shadowed-variable
        .subscribe(value => {
          setTimeout(() => {
            this.dataSource = new MatTableDataSource(value.data.data);
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
            // Sort item inside inner Object
            this.dataSource.sortingDataAccessor = (item, property) => {
              switch (property) {
                case 'client.name':
                  return item.client.name;
                default:
                  return item[property];
              }
            };
          }, 300);
        });
    }
    let entryDateArray;
    entryDateArray = event.targetElement.value.split('/');
    this.entryDate =
      entryDateArray[1] + '/' + entryDateArray[0] + '/' + entryDateArray[2];
    this.toDate =
      entryDateArray[2] + '/' + entryDateArray[0] + '/' + entryDateArray[1];
    this.api
      .get('sales', {
        branch_id: this.branch_id,
        receipt_number: this.receipt_number,
        metal_type: this.metal_type,
        from_date: this.fromDate,
        to_date: this.toDate,
        per_page: 50
      })
      // tslint:disable-next-line: no-shadowed-variable
      .subscribe(value => {
        setTimeout(() => {
          this.dataSource = new MatTableDataSource(value.data.data);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
          // Sort item inside inner Object
          this.dataSource.sortingDataAccessor = (item, property) => {
            switch (property) {
              case 'client.name':
                return item.client.name;
              default:
                return item[property];
            }
          };
        }, 300);
      });
  }
  // ----------------------------------- Filter Metal
  private filterMetal(value) {
    // tslint:disable-next-line: triple-equals
    if (value == '' || value == undefined) {
      this.metal_type = '';
      // Send Request
      this.api
        .get('sales', {
          branch_id: this.branch_id,
          receipt_number: this.receipt_number,
          metal_type: this.metal_type,
          from_date: this.fromDate,
          to_date: this.toDate,
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
                case 'product.metal.name':
                  return item.product.metal.name;
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
      const filterValue = value.name;
      this.metal_type = value.id;
      // Send Request
      this.api
        .get('sales', {
          branch_id: this.branch_id,
          receipt_number: this.receipt_number,
          metal_type: this.metal_type,
          from_date: this.fromDate,
          to_date: this.toDate,
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
                case 'product.metal.name':
                  return item.product.metal.name;
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
      return this.metals.filter(option => option.name.includes(filterValue));
      // tslint:disable-next-line: triple-equals
    } else if (typeof value == 'string') {
      // value = this.tem_category;
      const filterValueName = value;
      const info = this.products.filter(option =>
        option.product.metal.name.includes(filterValueName)
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
          case 'product.metal.name':
            return item.product.metal.name;
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
      return this.metals.filter(option =>
        option.name.includes(filterValueName)
      );
    }
  }
  // ----------------------------------------- Display Codes
  displaMetal(metal): string {
    console.log(metal);
    return metal ? metal.name : metal;
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
  openDetailsPopup(row) {
    this.detailsModal.show();
    this.stockData = row;
    console.log(this.stockData);
  }
  // --------------------------- Pagniation & Number of items showed in the page
  onPaginateChange(event) {
    console.log(event.pageSize);
    this.api
      .get('sales', {
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
            case 'product.label':
              return item.product.label;
            case 'product.metal.name':
              return item.product.metal.name;
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
  }

  /* ------------------------- Refund Action ---------------------------- */
  routeToReturn(row) {
    console.log('Item To Return: ', row);
    this.router.navigate(['/sales/return'], {
      queryParams: { id: row.product_id },
      skipLocationChange: true
    });
  }
  /*--------------------------------- Logout ------------------------------ */
  logout() {
    sessionStorage.removeItem('token');
    this.router.navigate(['/']);
  }
}
