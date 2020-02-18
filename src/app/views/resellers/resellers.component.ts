import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { MainServiceService } from '../../shared-services/main-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { startWith, map } from 'rxjs/operators';

@Component({
  templateUrl: 'resellers.component.html'
})
export class ResllersComponent implements OnInit {
  // Variables
  @ViewChild('detailsModal', { static: false })
  public detailsModal: ModalDirective;
  @ViewChild('sellerModal', { static: false })
  public sellerModal: ModalDirective;
  selection = new SelectionModel<any>(true, []);
  //  --------------------------------------   Tables Colums
  displayedColumns: string[] = [
    'select',
    'id',
    'product.label',
    'branch.name',
    'created_at',
    'product.item_total_after_profit',
    'client.name',
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
  myControlLabel = new FormControl('');
  myControlDate = new FormControl('');
  myControlClient = new FormControl('');
  // ------------------------------------------------------ ASYNC
  filteredBranches: Observable<string[]>;
  filteredLabels: Observable<string[]>;
  filteredDates: Observable<string[]>;
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
  client_id: any = '';
  branch_id: any = '';
  status_id: any = '';
  branchList: any;
  metalValue: any = '';
  label: any = '';
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
  clients: any = [];
  labelValue = '';
  clientValue = '';
  pageIndex;
  numberOfPages = [];
  currentPage;
  labels = [];
  totalProducts: any;
  countProducts: any;
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
  resellerForm = new FormGroup({
    client_id: new FormControl(''),
    branch_id: new FormControl(''),
    notes: new FormControl(''),
    product_id: new FormControl('')
  });
  goldWeight: number;
  goldPrice: number;
  goldTotal: number;
  item_total: number;
  item_total_after_profit: number;
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
      this.branchList = data.branches.data;
      // --------------------------------------- Get Sales
      this.products = data.resellers.data.data;
      this.totalProducts = data.resellers.total;
      this.countProducts = data.resellers.count;
      // ---------------------------------------- Get Clients
      this.clients = data.clients;
      console.log(this.clients);
      // -------------------------------------- Get Labels
      this.api
        .get('products', {
          status: 'AVAILABLE',
          per_page: 100
        })
        .subscribe(val => {
          console.log(val);
          this.labels = val.data.data;
        });
      this.data = Object.assign(data.resellers.data.data);
      this.dataSource = new MatTableDataSource(data.resellers.data.data);
      this.pageIndex = data.resellers.data.last_page;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      // Sort item inside inner Object
      this.dataSource.sortingDataAccessor = (item, property) => {
        switch (property) {
          case 'product.label':
            return item.product.label;
          case 'branch.name':
            return item.branch.name;
          case 'client.name':
            return item.client.name;
          case 'created_at':
            return item.created_at;
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
    this.filteredLabels = this.myControlLabel.valueChanges.pipe(
      startWith(''),
      map(value => this.filterLabel(value))
    );
    this.filteredClients = this.myControlClient.valueChanges.pipe(
      startWith(''),
      map(value => this.filterClients(value))
    );
  }

  // Oninit
  // tslint:disable-next-line: use-lifecycle-interface
  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
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
        .get('reseller', {
          branch_id: this.branch_id,
          client_id: this.client_id,
          from_date: this.fromDate,
          to_date: this.toDate,
          product_id: this.label,
          per_page: 50
        })
        // tslint:disable-next-line: no-shadowed-variable
        .subscribe(value => {
          console.log(value);
          setTimeout(() => {
            this.dataSource = new MatTableDataSource(value.data.data);
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
            this.totalProducts = value.total;
            this.countProducts = value.count;
            // Sort item inside inner Object
            this.dataSource.sortingDataAccessor = (item, property) => {
              switch (property) {
                case 'product.label':
                  return item.product.label;
                case 'branch.name':
                  return item.branch.name;
                case 'client.name':
                  return item.client.name;
                case 'created_at':
                  return item.created_at;
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
        .get('reseller', {
          branch_id: this.branch_id,
          client_id: this.client_id,
          from_date: this.fromDate,
          to_date: this.toDate,
          product_id: this.label,
          per_page: 50
        })
        // tslint:disable-next-line: no-shadowed-variable
        .subscribe(value => {
          console.log(value);
          setTimeout(() => {
            this.dataSource = new MatTableDataSource(value.data.data);
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
            this.totalProducts = value.total;
            this.countProducts = value.count;
            // Sort item inside inner Object
            this.dataSource.sortingDataAccessor = (item, property) => {
              switch (property) {
                case 'product.label':
                  return item.product.label;
                case 'branch.name':
                  return item.branch.name;
                case 'client.name':
                  return item.client.name;
                case 'created_at':
                  return item.created_at;
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
        option.branch.name.toLowerCase().includes(filterValueName)
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
          case 'branch.name':
            return item.branch.name;
          case 'client.name':
            return item.client.name;
          case 'created_at':
            return item.created_at;
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
  private filterLabel(value) {
    // tslint:disable-next-line: triple-equals
    if (value == '' || value == undefined) {
      this.label = '';
      // Send Request
      this.api
        .get('reseller', {
          branch_id: this.branch_id,
          client_id: this.client_id,
          from_date: this.fromDate,
          to_date: this.toDate,
          product_id: this.label,
          per_page: 50
        })
        // tslint:disable-next-line: no-shadowed-variable
        .subscribe(value => {
          console.log(value);
          setTimeout(() => {
            this.dataSource = new MatTableDataSource(value.data.data);
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
            this.totalProducts = value.total;
            this.countProducts = value.count;
            // Sort item inside inner Object
            this.dataSource.sortingDataAccessor = (item, property) => {
              switch (property) {
                case 'product.label':
                  return item.product.label;
                case 'branch.name':
                  return item.branch.name;
                case 'client.name':
                  return item.client.name;
                case 'created_at':
                  return item.created_at;
                default:
                  return item[property];
              }
            };
          }, 300);
        });
    }
    // tslint:disable-next-line: triple-equals
    if (typeof value == 'object') {
      const filterValue = value.product.label;
      this.label = value.product.id;
      console.log(this.label);
      // Send Request
      this.api
        .get('reseller', {
          branch_id: this.branch_id,
          client_id: this.client_id,
          from_date: this.fromDate,
          to_date: this.toDate,
          product_id: this.label,
          per_page: 50
        })
        // tslint:disable-next-line: no-shadowed-variable
        .subscribe(value => {
          console.log(value);
          setTimeout(() => {
            this.dataSource = new MatTableDataSource(value.data.data);
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
            this.totalProducts = value.total;
            this.countProducts = value.count;
            // Sort item inside inner Object
            this.dataSource.sortingDataAccessor = (item, property) => {
              switch (property) {
                case 'product.label':
                  return item.product.label;
                case 'branch.name':
                  return item.branch.name;
                case 'client.name':
                  return item.client.name;
                case 'created_at':
                  return item.created_at;
                default:
                  return item[property];
              }
            };
          }, 300);
        });
      return this.products.filter(option =>
        option.product.label.includes(filterValue)
      );
      // tslint:disable-next-line: triple-equals
    } else if (typeof value == 'string') {
      // value = this.tem_category;
      const filterValueName = value;
      const info = this.products.filter(option =>
        option.product.label.includes(filterValueName)
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
          case 'branch.name':
            return item.branch.name;
          case 'client.name':
            return item.client.name;
          case 'created_at':
            return item.created_at;
          default:
            return item[property];
        }
      };
      return this.products.filter(option =>
        option.product.label.includes(filterValueName)
      );
    }
  }
  // ----------------------------------------- Display Invoices
  displayLabel(code): string {
    console.log(code);

    return code ? code.product.label : code;
  }
  /* ---------------------------- Data Format Change ------------------------ */
  // 1
  entryDateFrom(event, type) {
    if (event.targetElement.value) {
      this.api
        .get('reseller', {
          branch_id: this.branch_id,
          client_id: this.client_id,
          product_id: this.label,
          per_page: 50
        })
        // tslint:disable-next-line: no-shadowed-variable
        .subscribe(value => {
          console.log(value);
          setTimeout(() => {
            this.dataSource = new MatTableDataSource(value.data.data);
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
            this.totalProducts = value.total;
            this.countProducts = value.count;
            // Sort item inside inner Object
            this.dataSource.sortingDataAccessor = (item, property) => {
              switch (property) {
                case 'product.label':
                  return item.product.label;
                case 'branch.name':
                  return item.branch.name;
                case 'client.name':
                  return item.client.name;
                case 'created_at':
                  return item.created_at;
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
      .get('reseller', {
        branch_id: this.branch_id,
        client_id: this.client_id,
        from_date: this.fromDate,
        to_date: this.toDate,
        product_id: this.label,
        per_page: 50
      })
      // tslint:disable-next-line: no-shadowed-variable
      .subscribe(value => {
        setTimeout(() => {
          this.dataSource = new MatTableDataSource(value.data.data);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
          this.totalProducts = value.total;
          this.countProducts = value.count;
          // Sort item inside inner Object
          this.dataSource.sortingDataAccessor = (item, property) => {
            switch (property) {
              case 'product.label':
                return item.product.label;
              case 'branch.name':
                return item.branch.name;
              case 'client.name':
                return item.client.name;
              case 'created_at':
                return item.created_at;
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
        .get('reseller', {
          branch_id: this.branch_id,
          client_id: this.client_id,
          product_id: this.label,
          per_page: 50
        })
        // tslint:disable-next-line: no-shadowed-variable
        .subscribe(value => {
          setTimeout(() => {
            this.dataSource = new MatTableDataSource(value.data.data);
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
            this.totalProducts = value.total;
            this.countProducts = value.count;
            // Sort item inside inner Object
            this.dataSource.sortingDataAccessor = (item, property) => {
              switch (property) {
                case 'product.label':
                  return item.product.label;
                case 'branch.name':
                  return item.branch.name;
                case 'client.name':
                  return item.client.name;
                case 'created_at':
                  return item.created_at;
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
      .get('reseller', {
        branch_id: this.branch_id,
        client_id: this.client_id,
        from_date: this.fromDate,
        to_date: this.toDate,
        product_id: this.label,
        per_page: 50
      })
      // tslint:disable-next-line: no-shadowed-variable
      .subscribe(value => {
        setTimeout(() => {
          this.dataSource = new MatTableDataSource(value.data.data);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
          this.totalProducts = value.total;
          this.countProducts = value.count;
          // Sort item inside inner Object
          this.dataSource.sortingDataAccessor = (item, property) => {
            switch (property) {
              case 'product.label':
                return item.product.label;
              case 'branch.name':
                return item.branch.name;
              case 'client.name':
                return item.client.name;
              case 'created_at':
                return item.created_at;
              default:
                return item[property];
            }
          };
        }, 300);
      });
  }
  // ----------------------------------- Filter Clients
  private filterClients(value) {
    // tslint:disable-next-line: triple-equals
    if (value == '' || value == undefined) {
      this.client_id = '';
      // Send Request
      this.api
        .get('reseller', {
          branch_id: this.branch_id,
          client_id: this.client_id,
          from_date: this.fromDate,
          to_date: this.toDate,
          product_id: this.label,
          per_page: 50
        })
        // tslint:disable-next-line: no-shadowed-variable
        .subscribe(value => {
          console.log(value);
          setTimeout(() => {
            this.dataSource = new MatTableDataSource(value.data.data);
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
            this.totalProducts = value.total;
            this.countProducts = value.count;
            // Sort item inside inner Object
            this.dataSource.sortingDataAccessor = (item, property) => {
              switch (property) {
                case 'product.label':
                  return item.product.label;
                case 'branch.name':
                  return item.branch.name;
                case 'client.name':
                  return item.client.name;
                case 'created_at':
                  return item.created_at;
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
      this.client_id = value.id;
      // Send Request
      this.api
        .get('reseller', {
          branch_id: this.branch_id,
          client_id: this.client_id,
          from_date: this.fromDate,
          to_date: this.toDate,
          product_id: this.label,
          per_page: 50
        })
        // tslint:disable-next-line: no-shadowed-variable
        .subscribe(value => {
          console.log(value);
          setTimeout(() => {
            this.dataSource = new MatTableDataSource(value.data.data);
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
            this.totalProducts = value.total;
            this.countProducts = value.count;
            // Sort item inside inner Object
            this.dataSource.sortingDataAccessor = (item, property) => {
              switch (property) {
                case 'product.label':
                  return item.product.label;
                case 'branch.name':
                  return item.branch.name;
                case 'client.name':
                  return item.client.name;
                case 'created_at':
                  return item.created_at;
                default:
                  return item[property];
              }
            };
          }, 300);
        });
      return this.clients.filter(option => option.name.includes(filterValue));
      // tslint:disable-next-line: triple-equals
    } else if (typeof value == 'string') {
      // value = this.tem_category;
      const filterValueName = value;

      const info = this.products.filter(option =>
        option.client.name.includes(filterValueName)
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
          case 'branch.name':
            return item.branch.name;
          case 'client.name':
            return item.client.name;
          case 'created_at':
            return item.created_at;
          default:
            return item[property];
        }
      };
      return this.clients.filter(option =>
        option.name.includes(filterValueName)
      );
    }
  }
  // ----------------------------------------- Display Codes
  displayClient(client): string {
    console.log(client);
    return client ? client.name : client;
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
    const items = row.product.stones;
    let sum = null;
    items.forEach(value => {
      sum += value.total;
    });
    this.item_total = +(row.product.gold_total + sum).toFixed(2);

    this.item_total_after_profit = Math.ceil(
      this.item_total * row.product.profit_percent
    );
  }

  /* ---------------------- Open Reseller ---------------------- */
  openReseller() {
    this.sellerModal.show();
  }

  onSubmitReseller(form) {
    console.log(form);
    this.api.post('reseller/add', form).subscribe(
      value => {
        console.log(value);
        this.toast.success('Reseller has been pending', '!Success');
        this.sellerModal.hide();
      },
      error => {
        console.log(error.error);
        this.modalError = error.error.errors;
      }
    );
    this.api
      .get('reseller', {
        per_page: 100
      })
      .subscribe(value => {
        console.log(value.data.data);
        this.dataSource = new MatTableDataSource(value.data.data);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.totalProducts = value.total;
        this.countProducts = value.count;
        // Sort item inside inner Object
        this.dataSource.sortingDataAccessor = (item, property) => {
          switch (property) {
            case 'product.label':
              return item.product.label;
            case 'branch.name':
              return item.branch.name;
            case 'client.name':
              return item.client.name;
            case 'created_at':
              return item.created_at;
            default:
              return item[property];
          }
        };
      });
  }
  // --------------------------- Pagniation & Number of items showed in the page

  onPaginateChange(event) {
    console.log(event);
    // this.per_page = event.pageSize;
    // this.api
    //   .get('reseller', {
    //     per_page: event.pageSize,
    //     page: 1
    //   })
    //   .subscribe((productList: any) => {
    //     console.log(productList);
    //     this.products = productList.data.data;
    //     this.pageIndex = productList.data.last_page;
    //     this.dataSource = new MatTableDataSource(productList.data.data);
    //     this.pageIndex = productList.data.last_page;
    //     this.dataSource.sort = this.sort;
    //     this.dataSource.paginator = this.paginator;
    //     this.dataSource.sortingDataAccessor = (item, property) => {
    //       switch (property) {
    //         case 'product.label':
    //           return item.product.label;
    //         case 'branch.name':
    //           return item.branch.name;
    //         case 'client.name':
    //           return item.client.name;
    //         case 'created_at':
    //           return item.created_at;
    //         default:
    //           return item[property];
    //       }
    //     };
    //     console.log(this.pageIndex);

    //     this.numberOfPages = [];
    //     for (let i = 1; i <= this.pageIndex; i++) {
    //       console.log(i);
    //       this.numberOfPages.push(i);
    //       this.numberOfPages.sort(function(a, b) {
    //         return a - b;
    //       });
    //     }
    //     console.log(this.numberOfPages);
    //   });
  }
  selectPage(event) {
    console.log(event);
    // this.currentPage = event;
    // this.api
    //   .get('reseller', {
    //     per_page: this.per_page,
    //     page: event
    //   })
    //   .subscribe((productList: any) => {
    //     console.log(productList.data.data);
    //     this.products = productList.data.data;
    //     this.pageIndex = productList.data.last_page;
    //     this.dataSource = new MatTableDataSource(productList.data.data);
    //     this.dataSource.sort = this.sort;
    //     this.dataSource.paginator = this.paginator;
    //     this.dataSource.sortingDataAccessor = (item, property) => {
    //       switch (property) {
    //         case 'product.label':
    //           return item.product.label;
    //         case 'branch.name':
    //           return item.branch.name;
    //         case 'client.name':
    //           return item.client.name;
    //         case 'created_at':
    //           return item.created_at;
    //         default:
    //           return item[property];
    //       }
    //     };
    //   });
  }
  /* ------------------------- Refund Action ---------------------------- */
  routeToSale(row) {
    console.log('Item To Sale: ', row);
    this.router.navigate(['/sales/make-new-sale'], {
      queryParams: { id: row.product.id },
      skipLocationChange: true
    });
  }
  /* ----------------------------- Return Action ---------------------- */
  routeToReturn(row) {
    console.log(row);
    this.api
      .post('reseller/refund', {
        id: row.id,
        product_id: row.product.id
      })
      .subscribe(
        value => {
          console.log(value);
          this.toast.success(
            row.product.label + ' has been Added to Stock List',
            '!Success'
          );
          this.router.navigateByUrl('/main-stock/stock-list');
        },
        error => {
          this.api.fireAlert(
            'error',
            'Error Happens in Add Product to Stock List',
            ''
          );
        }
      );
  }
  /*--------------------------------- Logout ------------------------------ */
  logout() {
    sessionStorage.removeItem('token');
    this.router.navigate(['/']);
  }
}
