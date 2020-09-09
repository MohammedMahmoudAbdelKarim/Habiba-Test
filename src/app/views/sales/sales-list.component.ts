import { Component, ViewChild } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ModalDirective } from 'ngx-bootstrap/modal';
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
  @ViewChild('invoiceModal', { static: false })
  public invoiceModal: ModalDirective;
  @ViewChild('invoiceModalView', { static: false })
  public invoiceModalView: ModalDirective;
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
    'receipts.total_egp',
    'receipts.paid_egp',
    'remaining',
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
  myControlClient = new FormControl('');
  // ------------------------------------------------------ ASYNC
  filteredBranches: Observable<string[]>;
  filteredInvoices: Observable<string[]>;
  filteredDates: Observable<string[]>;
  filteredMetals: Observable<string[]>;
  filteredClients: Observable<string[]>;
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
  clientValue: any = '';
  stockData: any = '';
  branchValue: string = '';
  categoryValue: string = '';
  codeValue: string = '';
  checkedItems: any = 0;
  statusValue: string = '';
  imgUrl: string = 'img/products/';
  baseUrl: string = 'http://jewelry.inspia.net/backend/img/products/';
  flage: boolean = false;
  modalError: any = [];
  transferName: any = '';
  transferCode: any = '';
  imgSrc: any = '';
  payment_id: any = '';
  payment_method: any = '1';
  invoiceData: any = '';
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
  pageIndex: any = '';
  numberOfPages: any = [];
  currentPage: any = '';
  clientArray: any = [];
  client_id: any = '';

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
  goldWeight: number;
  goldPrice: number;
  goldTotal: number;
  item_total_after_profit: number;
  item_total: number;
  inoviceBranch: any;
  inoviceClient: any;
  inoviceEmployee: any;
  product: any;
  inoviceCity: any;
  inoviceAddress: any;
  inovicePhone: any;
  receipts: any;
  receiptDateInvoice: any;
  totalEGP: any;
  paidAmount: any;
  settings_address: any;
  settings_phone: any;
  settings_website: any;
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
      // --------------------------------------- Get Clients
      this.clientArray = data.clients;
      this.products = data.receipts.data.data;
      this.data = Object.assign(data.receipts.data.data);
      this.pageIndex = data.receipts.data.last_page;
      console.log(data.receipts.data.data);
      console.log(data.receipts.data.last_page);
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
          case 'receipts.total_egp':
            return item.receipts.total_egp;
          case 'receipts.receipt_number':
            return item.receipts.receipt_number;
          case 'receipts.paid_egp':
            return item.receipts.paid_egp;
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
    this.filteredClients = this.myControlClient.valueChanges.pipe(
      startWith(''),
      map(value => this.filterClient(value))
    );
  }

  // Oninit
  // tslint:disable-next-line: use-lifecycle-interface
  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    // console.log(this.pageIndex);

    // for (let i = 1; i <= this.pageIndex; i++) {
    //   console.log(i);
    //   this.numberOfPages.push(i);
    //   this.numberOfPages.sort(function(a, b) {
    //     return a - b;
    //   });
    // }
    // console.log(this.numberOfPages);
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
                case 'receipts.total_egp':
                  return item.receipts.total_egp;
                case 'receipts.receipt_number':
                  return item.receipts.receipt_number;
                case 'receipts.paid_egp':
                  return item.receipts.paid_egp;
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
                case 'receipts.total_egp':
                  return item.receipts.total_egp;
                case 'receipts.receipt_number':
                  return item.receipts.receipt_number;
                case 'receipts.paid_egp':
                  return item.receipts.paid_egp;
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
          case 'receipts.total_egp':
            return item.receipts.total_egp;
          case 'receipts.receipt_number':
            return item.receipts.receipt_number;
          case 'receipts.paid_egp':
            return item.receipts.paid_egp;
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

  // ----------------------------------------- Filter Client
  private filterClient(value) {
    // tslint:disable-next-line: triple-equals
    if (value == '' || value == undefined) {
      console.log(this.products);

      this.client_id = '';
      // Send Request
      this.api
        .get('sales', {
          branch_id: this.branch_id,
          receipt_number: this.receipt_number,
          receipt_date: this.receipt_date,
          metal_type: this.metal_type,
          per_page: 50,
          client_id: this.client_id
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
                case 'receipts.total_egp':
                  return item.receipts.total_egp;
                case 'receipts.receipt_number':
                  return item.receipts.receipt_number;
                case 'receipts.paid_egp':
                  return item.receipts.paid_egp;
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
      this.client_id = value.id;
      console.log(this.client_id);
      // Send Request
      this.api
        .get('sales', {
          branch_id: this.branch_id,
          receipt_number: this.receipt_number,
          receipt_date: this.receipt_date,
          metal_type: this.metal_type,
          client_id: this.client_id,
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
                case 'receipts.total_egp':
                  return item.receipts.total_egp;
                case 'receipts.receipt_number':
                  return item.receipts.receipt_number;
                case 'receipts.paid_egp':
                  return item.receipts.paid_egp;
                default:
                  return item[property];
              }
            };
          }, 300);
        });
      return this.clientArray.filter(option =>
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
          case 'receipts.total_egp':
            return item.receipts.total_egp;
          case 'receipts.receipt_number':
            return item.receipts.receipt_number;
          case 'receipts.paid_egp':
            return item.receipts.paid_egp;
          default:
            return item[property];
        }
      };
      return this.clientArray.filter(option =>
        option.name.toLowerCase().includes(filterValueName)
      );
    }
  }
  // ----------------------------------------- Display Branches
  displayClient(branch): string {
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
                case 'receipts.total_egp':
                  return item.receipts.total_egp;
                case 'receipts.receipt_number':
                  return item.receipts.receipt_number;
                case 'receipts.paid_egp':
                  return item.receipts.paid_egp;
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
                case 'receipts.total_egp':
                  return item.receipts.total_egp;
                case 'receipts.receipt_number':
                  return item.receipts.receipt_number;
                case 'receipts.paid_egp':
                  return item.receipts.paid_egp;
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
          case 'receipts.total_egp':
            return item.receipts.total_egp;
          case 'receipts.receipt_number':
            return item.receipts.receipt_number;
          case 'receipts.paid_egp':
            return item.receipts.paid_egp;
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
  /* --------------------------- Clear From Data ----------------------------- */
  getFromData() {
    this.fromDate = '';
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
              case 'receipts.total_egp':
                return item.receipts.total_egp;
              case 'receipts.paid_egp':
                return item.receipts.paid_egp;
              default:
                return item[property];
            }
          };
        }, 300);
      });
  }
  /* --------------------------- Clear To Data ----------------------------- */
  getToData() {
    this.toDate = '';
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
              case 'receipts.total_egp':
                return item.receipts.total_egp;
              case 'receipts.paid_egp':
                return item.receipts.paid_egp;
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
                case 'receipts.total_egp':
                  return item.receipts.total_egp;
                case 'receipts.paid_egp':
                  return item.receipts.paid_egp;
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
                case 'receipts.total_egp':
                  return item.receipts.total_egp;
                case 'receipts.paid_egp':
                  return item.receipts.paid_egp;
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
          case 'receipts.total_egp':
            return item.receipts.total_egp;
          case 'receipts.paid_egp':
            return item.receipts.paid_egp;
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
    this.goldWeight = +(+row.product.gold_weight).toFixed(2);
    this.goldPrice = +(+row.product.gold_price).toFixed(2);
    this.goldTotal = +(+row.product.gold_total).toFixed(2);
    const items = row.stones;
    let sum = null;
    items.forEach(value => {
      sum += value.total;
    });
    this.item_total = +(row.product.gold_total + sum).toFixed(2);

    this.item_total_after_profit = Math.ceil(
      this.item_total * row.product.profit_percent
    );
  }
  /* ---------- Pagniation & Number of items showed in the page ------------- */
  onPaginateChange(event) {
    console.log(event);
    // this.api
    //   .get('sales', {
    //     per_page: event.pageSize,
    //     page: 1
    //   })
    //   .subscribe((productList: any) => {
    //     console.log(productList);
    //     this.products = productList.data.data;
    //     this.dataSource = new MatTableDataSource(productList.data.data);
    //     this.pageIndex = productList.data.last_page;
    //     this.dataSource.sort = this.sort;
    //     this.dataSource.paginator = this.paginator;
    //     this.dataSource.sortingDataAccessor = (item, property) => {
    //       switch (property) {
    //         case 'product.label':
    //           return item.product.label;
    //         case 'product.metal.name':
    //           return item.product.metal.name;
    //         case 'receipts.branch.name':
    //           return item.receipts.branch.name;
    //         case 'receipts.employee.name':
    //           return item.receipts.employee.name;
    //         case 'receipts.receipt_number':
    //           return item.receipts.receipt_number;
    //         default:
    //           return item[property];
    //       }
    //     };
    //   });
    // console.log(this.pageIndex);

    // this.numberOfPages = [];
    // for (let i = 1; i <= this.pageIndex; i++) {
    //   console.log(i);
    //   this.numberOfPages.push(i);
    //   this.numberOfPages.sort(function(a, b) {
    //     return a - b;
    //   });
    // }
    // console.log(this.numberOfPages);
  }
  selectPage(event) {
    console.log(event);
    // this.currentPage = event;
    // this.api
    //   .get('sales', {
    //     per_page: 10,
    //     page: this.currentPage
    //   })
    //   .subscribe((productList: any) => {
    //     console.log(productList.data.data);
    //     this.products = productList.data.data;
    //     this.dataSource = new MatTableDataSource(productList.data.data);
    //     this.dataSource.sort = this.sort;
    //     this.dataSource.paginator = this.paginator;
    //     this.dataSource.sortingDataAccessor = (item, property) => {
    //       switch (property) {
    //         case 'category.name':
    //           return item.category.name;
    //         case 'branch.name':
    //           return item.branch.name;
    //         case 'status.name':
    //           return item.status.name;
    //         default:
    //           return item[property];
    //       }
    //     };
    //   });
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
  /* ------------------------------ Open Inovice ----------------------- */
  openInvoice(row) {
    console.log(row);
    this.invoiceModalView.show();
    this.api.get('settings', { per_page: 50 }).subscribe(data => {
      console.log(data.data);
      this.settings_address = data.data[0].address;
      this.settings_phone = data.data[0].phone;
      this.settings_website = data.data[0].website;
    });
    this.invoiceData = row;
    this.receiptDateInvoice = row.receipts.receipt_date;
    this.totalEGP = row.receipts.total_egp;
    this.paidAmount = row.receipts.paid_egp;
    this.inoviceClient = row.receipts.client.name;
    this.inoviceEmployee = row.receipts.employee.name;
    this.inoviceBranch = row.receipts.branch.name;
    this.product = row.product;
    this.inoviceCity = row.receipts.branch.city.name;
    this.inoviceAddress = row.receipts.branch.address;
    this.inovicePhone = row.receipts.branch.phone;
    // console.log(this.inoviceProducts);
  }
  /* -------------------------- Print ---------------------------- */
  print(row) {
    this.invoiceModal.show();
    this.api.get('settings', { per_page: 50 }).subscribe(data => {
      console.log(data.data);
      this.settings_address = data.data[0].address;
      this.settings_phone = data.data[0].phone;
      this.settings_website = data.data[0].website;
    });
    this.invoiceData = row;
    this.receiptDateInvoice = row.receipts.receipt_date;
    this.totalEGP = row.receipts.total_egp;
    this.paidAmount = row.receipts.paid_egp;
    this.inoviceClient = row.receipts.client.name;
    this.inoviceEmployee = row.receipts.employee.name;
    this.inoviceBranch = row.receipts.branch.name;
    this.product = row.product;
    this.inoviceCity = row.receipts.branch.city.name;
    this.inoviceAddress = row.receipts.branch.address;
    this.inovicePhone = row.receipts.branch.phone;
    setTimeout(() => {
      window.print();
    }, 3000);
  }
}
