import { MainServiceService } from './../../shared-services/main-service.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { ModalDirective } from 'ngx-bootstrap/modal';
import htmlToImage from 'html-to-image';
import html2canvas from 'html2canvas';
import $ from 'jquery';

@Component({
  templateUrl: 'client-history.component.html'
})
export class ClientHistoryComponent implements OnInit {
  /* ------------------------------------- Variables ------------------------ */
  // Modals
  @ViewChild('myModal', { static: false }) public myModal: ModalDirective;
  @ViewChild('detailsModal', { static: false })
  public detailsModal: ModalDirective;
  @ViewChild('labelModal', { static: false })
  public labelModal: ModalDirective;
  @ViewChild('labelModal2', { static: false })
  public labelModal2: ModalDirective;
  @ViewChild('editModal', { static: false })
  public editModal: ModalDirective;
  @ViewChild('stoneModal', { static: false })
  public stoneModal: ModalDirective;
  @ViewChild('deleteModal', { static: false })
  public deleteModal: ModalDirective;
  @ViewChild('delete2Modal', { static: false })
  public delete2Modal: ModalDirective;
  @ViewChild('myModalImg', { static: false }) public myModalImg: ModalDirective;
  @ViewChild('resellerModal', { static: false })
  public resellerModal: ModalDirective;

  // Tables Colums
  displayedColumns: string[] = [
    'select',
    'client.name',
    'product.label',
    'action',
    'created_at',
    'receipt.total_egp',
    'payment_status',
    'remaining'
  ];
  dataSource: MatTableDataSource<any> = new MatTableDataSource([]);
  selection = new SelectionModel<any>(true, []);
  // Sort & Pagination
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  // Boolean
  showDetailsPopup: boolean = false;
  showUpdataPopup: boolean = false;
  showDeletePopup: boolean = false;
  DeletingHold: boolean = false;
  deleteFlage: boolean = false;
  checkItemDataCalculatedIsDefiend: boolean = false;
  testValueBoolean: boolean = true;
  stoneFlage: boolean = false;
  imageUploadedOnInput: boolean = true;
  flage: boolean = false;
  imageArray = '';
  // ASYNC
  filteredCodes: Observable<string[]>;
  filteredStatus: Observable<string[]>;
  filteredClients: Observable<string[]>;
  // Arrays and Inital Variables
  hideme: any = [];
  products: any = [];
  statusList: any = [];
  pageNumbers: any = [];
  categoryList: any = [];
  productNumbersList: any = [];
  stones: any = [];
  data: any;
  codeList: any;
  branchList: any;
  deleteItem: any;
  deletedStockIndex: any;
  stoneTotal: any;
  imageFile;
  StochImage;
  stonePrice: any;
  stonesArray: any;
  stoneSetting: any;
  newPriceValue: any;
  newWeightValue: any;
  newSettingValue: any;
  clientValue: any = '';
  newQuantityValue: any;
  newGoldPriceValue: any;
  labelCost: any;
  newGoldWeightValue: any;
  ItemDataCalculated: any = {};
  stoneList: any = [];
  modalError: any = [];
  newStoneArray: any = [];
  testStonesArray: any = [];
  clients: any = [];
  label: any = '';
  entryDate: any = '';
  fromDate: any = '';
  toDate: any = '';
  stockData: any = {};
  labelData: any = {};
  updatedItemData: any = {};
  branch_id: any = '';
  status_id: any = '';
  client_id: any = '';
  codeValue: string = '';
  tem_category: any = '';
  branchValue: string = '';
  categoryValue: string = '';
  statusValue: string = '';
  status: string = '';
  category: string = '';
  branch: string = '';
  reseller: any = '';
  resellerBranch: any = '';
  imgUrl: string = 'img/products/';
  baseUrl: string = 'http://jewelry.inspia.net/backend/img/products/';
  transferName: any = '';
  transferCode: any = '';
  imgSrc: any = '';
  per_page: number = 10;
  pageEvent: any;
  totalSearch: any = '';
  totalCost: any = '';
  finalCost: any = '';
  productTransferID: any;
  checkedItems: any = 0;
  stone_id: any = '';
  pageSize: any = 10;
  imagePlaceHolder: any = 'Stock Image';
  stonAreaPlaceHolder: any = 'No Stones Added Yet';
  imageBase64StringCharacter: any;

  // Form Controls
  myControlCode = new FormControl('');
  myControlClient = new FormControl('');
  myControlStatus = new FormControl('');
  /* ----------------------------------- Form ------------------------ */
  // Delete Form
  deleteForm = new FormGroup({
    deleteInput: new FormControl('')
  });
  selectNumberOfProductForm = new FormGroup({
    numberOfProducts: new FormControl('')
  });
  // Transfer Form
  transferForm = new FormGroup({
    branch_id: new FormControl('', Validators.required)
  });
  // Stock Form
  stockUpdatForm = new FormGroup({
    updateStockTotalPrice: new FormControl(''),
    updateGoldWeight: new FormControl(''),
    updateGoldPrice: new FormControl(''),
    updateStonesQuantity: new FormControl(''),
    upadateStonesName: new FormControl(''),
    updateSettingsSetting: new FormControl(''),
    profit_percent: new FormControl(''),
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
  // Reseller Form
  resellerForm = new FormGroup({
    client_id: new FormControl('', Validators.required),
    branch_id: new FormControl('', Validators.required),
    product_id: new FormControl('', Validators.required),
    note: new FormControl('')
  });
  pageIndex: any;
  numberOfPages: any = [];
  currentPage: any = 1;
  goldWeight: any;
  goldPrice: number;
  goldTotal: any;
  totalPrice: void;
  total_price: number;
  imageExtention: any;
  totalProducts: any;
  countProducts: any;

  /* ----------------------------------- Constructor ------------------------ */
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
      // -------------------------------------- Get Categories
      this.categoryList = data.categoryList.data;
      // --------------------------------------- Get Products
      this.products = data.history.data;
      this.pageIndex = data.history.data.last_page;
      this.data = Object.assign(data.history.data);
      this.totalSearch = data.history.data.total;
      // this.pageIndex
      this.dataSource = new MatTableDataSource(data.history.data.data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.totalProducts = data.history.total;
      this.countProducts = data.history.count;
      // Sort item inside inner Object
      this.dataSource.sortingDataAccessor = (item, property) => {
        switch (property) {
          case 'client.name':
            return item.client.name;
          case 'product.label':
            return item.product.label;
          default:
            return item[property];
        }
      };

      // -------------------------------------- Get Status
      this.statusList = ['Purchase', 'Refund'];
      // -------------------------------------- Get Stones
      this.stoneList = data.stones.data;
      // -------------------------------------- Get Status
      this.clients = data.clients;
    });
    // Filter Clients
    this.filteredClients = this.myControlClient.valueChanges.pipe(
      startWith(''),
      map(value => this.filterClient(value))
    );
    // Filter Codes
    this.filteredCodes = this.myControlCode.valueChanges.pipe(
      startWith(''),
      map(value => this.fitlerCode(value))
    );
    // Filter Status
    this.filteredStatus = this.myControlStatus.valueChanges.pipe(
      startWith(''),
      map(value => this.filterStatus(value))
    );
  }
  /* ----------------------------------- OnInit ------------------------ */
  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    // for (let i = 1; i <= this.pageIndex; i++) {
    //   this.numberOfPages.push(i);
    //   this.numberOfPages.sort(function(a, b) {
    //     return a - b;
    //   });
    // }
  }
  // ----------------------------------------- Filter Client
  private filterClient(value) {
    // tslint:disable-next-line: triple-equals
    if (value == '' || value == undefined) {
      this.client_id = '';
      // Send Request
      this.api
        .get('clients/history', {
          client_id: this.client_id,
          action: this.status_id,
          date_from: this.fromDate,
          date_to: this.toDate,
          product: this.label,
          per_page: this.per_page
        })
        // tslint:disable-next-line: no-shadowed-variable
        .subscribe(value => {
          console.log('Clients ', value.data.data);
          setTimeout(() => {
            this.dataSource = new MatTableDataSource(value.data.data);
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
            // Sort item inside inner Object
            this.dataSource.sortingDataAccessor = (item, property) => {
              switch (property) {
                case 'client.name':
                  return item.client.name;
                case 'product.label':
                  return item.product.label;
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
      // console.log(this.client_id);
      // Send Request
      this.api
        .get('clients/history', {
          client_id: this.client_id,
          action: this.status_id,
          date_from: this.fromDate,
          date_to: this.toDate,
          product: this.label,
          per_page: this.per_page
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
                case 'product.label':
                  return item.product.label;
                default:
                  return item[property];
              }
            };
          }, 300);
        });
      return this.clients.filter(option =>
        option.name.toLowerCase().includes(filterValue)
      );
      // tslint:disable-next-line: triple-equals
    } else if (typeof value == 'string') {
      const filterValueName = value.toLowerCase();
      const info = this.products.data.filter(option =>
        option.client.name.toLowerCase().includes(filterValueName)
      );
      console.log('Filter -> ', info);
      this.dataSource = new MatTableDataSource(info);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      // Sort item inside inner Object
      this.dataSource.sortingDataAccessor = (item, property) => {
        switch (property) {
          case 'client.name':
            return item.client.name;
          case 'product.label':
            return item.product.label;
          default:
            return item[property];
        }
      };
      return this.clients.filter(option =>
        option.name.toLowerCase().includes(filterValueName)
      );
    }
  }
  // ----------------------------------------- Display Branches
  displayClient(branch): string {
    return branch ? branch.name : branch;
  }
  /* ---------------------------- Filter Codes ------------------------ */
  private fitlerCode(value) {
    // tslint:disable-next-line: triple-equals
    if (value == '' || value == undefined) {
      this.label = '';
      // Send Request
      this.api
        .get('clients/history', {
          client_id: this.client_id,
          action: this.status_id,
          date_from: this.fromDate,
          date_to: this.toDate,
          product: this.label,
          per_page: this.per_page
        })
        // tslint:disable-next-line: no-shadowed-variable
        .subscribe(value => {
          console.log('Code -> ', value.data.data);
          setTimeout(() => {
            this.dataSource = new MatTableDataSource(value.data.data);
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
            this.totalProducts = value.total;
            this.countProducts = value.count;
            // Sort item inside inner Object
            this.dataSource.sortingDataAccessor = (item, property) => {
              switch (property) {
                case 'client.name':
                  return item.client.name;
                case 'product.label':
                  return item.product.label;
                default:
                  return item[property];
              }
            };
          }, 300);
        });
    }
    // tslint:disable-next-line: triple-equals
    if (typeof value == 'object') {
      console.log(value);

      const filterValue = value.product.label.toLowerCase();
      this.label = value.product.label;
      // Send Request
      this.api
        .get('clients/history', {
          client_id: this.client_id,
          action: this.status_id,
          date_from: this.fromDate,
          date_to: this.toDate,
          product: this.label,
          per_page: this.per_page
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
                case 'client.name':
                  return item.client.name;
                case 'product.label':
                  return item.product.label;
                default:
                  return item[property];
              }
            };
          }, 300);
        });
      return this.products.data.filter(option =>
        option.product.label.toLowerCase().includes(filterValue)
      );
      // tslint:disable-next-line: triple-equals
    } else if (typeof value == 'string') {
      this.api
        .get('clients/history', {
          branch_id: this.branch_id,
          client_id: this.client_id,
          label: value,
          status_id: this.status_id,
          per_page: this.per_page,
          page: this.currentPage
        })
        .subscribe(value => {
          this.dataSource = new MatTableDataSource(value.data.data);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
          // Sort item inside inner Object
          this.dataSource.sortingDataAccessor = (item, property) => {
            switch (property) {
              case 'client.name':
                return item.client.name;
              case 'product.label':
                return item.product.label;
              default:
                return item[property];
            }
          };
        });
      // value = this.tem_client;
      const filterValueName = value.toLowerCase();
      const info = this.products.data.filter(option =>
        option.product.label.toLowerCase().includes(filterValueName)
      );
      this.dataSource = new MatTableDataSource(info);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      // Sort item inside inner Object
      this.dataSource.sortingDataAccessor = (item, property) => {
        switch (property) {
          case 'client.name':
            return item.client.name;
          case 'product.label':
            return item.product.label;
          default:
            return item[property];
        }
      };
      return this.products.data.filter(option =>
        option.product.label.toLowerCase().includes(filterValueName)
      );
    }
  }
  /* ---------------------------- Display Codes ------------------------ */
  displayCode(code): string {
    return code ? code.product.label : code;
  }
  /* ---------------------------- Filter Status ------------------------ */
  private filterStatus(value) {
    // tslint:disable-next-line: triple-equals
    if (value == '' || value == undefined) {
      this.status_id = '';
      // Send Request
      this.api
        .get('clients/history', {
          branch_id: this.branch_id,
          client_id: this.client_id,
          label: this.label,
          status_id: this.status_id,
          per_page: this.per_page,
          page: this.currentPage
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
                case 'product.label':
                  return item.product.label;
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
      this.status_id = value.action;
      // Send Request
      this.api
        .get('clients/history', {
          branch_id: this.branch_id,
          client_id: this.client_id,
          label: this.label,
          status_id: this.status_id,
          per_page: 'all',
          page: this.currentPage
        })
        // tslint:disable-next-line: no-shadowed-variable
        .subscribe(value => {
          setTimeout(() => {
            console.log(value.data.data);

            this.dataSource = new MatTableDataSource(value.data.data);
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
            this.totalProducts = value.total;
            this.countProducts = value.count;
            // Sort item inside inner Object
            this.dataSource.sortingDataAccessor = (item, property) => {
              switch (property) {
                case 'client.name':
                  return item.client.name;
                case 'product.label':
                  return item.product.label;
                default:
                  return item[property];
              }
            };
          }, 300);
        });
      return this.statusList.filter(option =>
        option.toLowerCase().includes(filterValue)
      );
      // tslint:disable-next-line: triple-equals
    } else if (typeof value == 'string') {
      // value = this.tem_client;
      const filterValueName = value.toLowerCase();
      const info = this.products.data.filter(option =>
        option.action.toLowerCase().includes(filterValueName)
      );
      this.dataSource = new MatTableDataSource(info);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      // Sort item inside inner Object
      this.dataSource.sortingDataAccessor = (item, property) => {
        switch (property) {
          case 'client.name':
            return item.client.name;
          case 'product.label':
            return item.product.label;
          default:
            return item[property];
        }
      };
      return this.statusList.filter(option =>
        option.toLowerCase().includes(filterValueName)
      );
    }
  }
  /* ---------------------------- Display Status ------------------------ */
  displayStatus(status): string {
    return status ? status : status;
  }
  // 1
  entryDateFrom(event, type) {
    if (event.targetElement.value) {
      this.api
        .get('clients/history', {
          branch_id: this.branch_id,
          // receipt_number: this.receipt_number,
          // metal_type: this.metal_type,
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
      .get('clients/history', {
        branch_id: this.branch_id,
        // receipt_number: this.receipt_number,
        // metal_type: this.metal_type,
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
        .get('clients/history', {
          branch_id: this.branch_id,
          // receipt_number: this.receipt_number,
          // metal_type: this.metal_type,
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
      .get('clients/history', {
        branch_id: this.branch_id,
        // receipt_number: this.receipt_number,
        // metal_type: this.metal_type,
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
      .get('clients/history', {
        // branch_id: this.branch_id,
        // receipt_number: this.receipt_number,
        // metal_type: this.metal_type,
        // from_date: this.fromDate,
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
              case 'client.name':
                return item.client.name;
              case 'product.label':
                return item.product.label;
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
      .get('clients/history', {
        branch_id: this.branch_id,
        // receipt_number: this.receipt_number,
        // metal_type: this.metal_type,
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
              case 'client.name':
                return item.client.name;
              case 'product.label':
                return item.product.label;
              default:
                return item[property];
            }
          };
        }, 300);
      });
  }

  /*--------------------------------- Logout ------------------------------ */
  logout() {
    sessionStorage.removeItem('token');
    this.router.navigate(['/']);
  }
}
