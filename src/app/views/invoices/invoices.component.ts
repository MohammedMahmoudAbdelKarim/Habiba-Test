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
  templateUrl: 'invoices.component.html'
})
export class InvoicesComponent {
  /* ------------------------------------- Variables ------------------------ */
  // Modals
  @ViewChild('myModalPayment', { static: false })
  public myModalPayment: ModalDirective;
  @ViewChild('myModalImg', { static: false }) public myModalImg: ModalDirective;
  @ViewChild('invoiceModal', { static: false })
  public invoiceModal: ModalDirective;
  // Tables Colums
  selection = new SelectionModel<any>(true, []);
  displayedColumns: string[] = [
    'select',
    'id',
    'receipt_date',
    'receipt_number',
    'client.name',
    'total_egp',
    'status',
    'actions'
  ];
  dataSource: MatTableDataSource<any> = new MatTableDataSource([]);
  // Sort & Pagination
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  // Boolean
  showDetailsPopup: boolean = false;
  showUpdataPopup: boolean = false;
  showDeletePopup: boolean = false;
  DeletingHold: boolean = false;
  deleteFlage: boolean = false;
  flage: boolean = false;
  // ASYNC
  filteredClients: Observable<string[]>;
  filteredInvoices: Observable<string[]>;
  filteredDates: Observable<string[]>;
  // Arrays and Inital Variables
  hideme: any = [];
  products: any = [];
  statusList: any = [];
  pageNumbers: any = [];
  categoryList: any = [];
  productNumbersList: any = [];
  clientList: any = [];
  codeList: any;
  deletedStockIndex: any;
  tem_category: any = '';
  receipt_number: any = '';
  client_name: any = '';
  status_id: any = '';
  branchList: any;
  deleteItem: any;
  receipt_date: any = '';
  data: any;
  stockData: any = '';
  branchValue: string = '';
  categoryValue: string = '';
  codeValue: string = '';
  currentPage;
  statusValue: string = '';
  imgUrl: string = 'img/products/';
  baseUrl: string = 'http://jewelry.inspia.net/backend/img/products/';
  modalError: any = [];
  transferName: any = '';
  transferCode: any = '';
  imgSrc: any = '';
  payment_id: any = '';
  invoiceValue: any = '';
  clientValue: any = '';
  pageEvent: any;
  totalSearch: any = '';
  productTransferID: any = '';
  entryDate: any = '';
  fromDate: any = '';
  toDate: any = '';
  payment_method: any = '1';
  checkedItems: any = 0;
  per_page: number = 50;
  invoiceData: any = '';
  inoviceEmployee: any = '';
  inoviceClient: any = '';
  inoviceBranch: any = '';
  inoviceProducts: any = [];
  settings_phone: any = '';
  settings_address: any = '';
  settings_website: any = '';
  inoviceCity: any = '';
  inoviceAddress: any = '';
  inovicePhone: any = '';
  pageIndex;
  numberOfPages = [];

  // Form Controls
  myControlClient = new FormControl('');
  myControlInvoice = new FormControl('');
  myControlDate = new FormControl('');
  /* ----------------------------------- Form ------------------------ */
  // Delete Form
  deleteForm = new FormGroup({
    deleteInput: new FormControl('')
  });
  // Payment Form
  paymentForm = new FormGroup({
    paidAmount: new FormControl('', Validators.required)
  });

  /* ----------------------------------- Constructor ------------------------ */
  constructor(
    private api: MainServiceService,
    private route: ActivatedRoute,
    private toast: ToastrService,
    private router: Router
  ) {
    this.route.data.subscribe(data => {
      console.log(data);
      // Get Invoices
      this.products = data.sales.data.data;
      // Get Clients
      this.clientList = data.clients;
      this.data = Object.assign(data.sales.data.data);
      console.log(data.sales.data.data);
      this.dataSource = new MatTableDataSource(data.sales.data.data);
      this.pageIndex = data.sales.data.last_page;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      // Sort item inside inner Object
      this.dataSource.sortingDataAccessor = (item, property) => {
        switch (property) {
          case 'client.name':
            return item.client.name;
          default:
            return item[property];
        }
      };
    });
    // Filter Clients
    this.filteredClients = this.myControlClient.valueChanges.pipe(
      startWith(''),
      map(value => this.filterClient(value))
    );
    // Filter Invoices
    this.filteredInvoices = this.myControlInvoice.valueChanges.pipe(
      startWith(''),
      map(value => this.filterInvoice(value))
    );
  }
  /* ----------------------------------- OnInit ------------------------ */
  // tslint:disable-next-line: use-lifecycle-interface
  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    console.log(this.pageIndex);

    for (let i = 1; i <= this.pageIndex; i++) {
      console.log(i);
      this.numberOfPages.push(i);
      this.numberOfPages.sort(function(a, b) {
        return a - b;
      });
    }
    console.log(this.numberOfPages);
  }
  /* ---------------------------- Filter Clients ------------------------ */
  private filterClient(value) {
    // tslint:disable-next-line: triple-equals
    if (value == '' || value == undefined) {
      this.client_name = '';
      // Send Request
      this.api
        .get('receipts', {
          client_name: this.client_name,
          receipt_number: this.receipt_number,
          date_from: this.fromDate,
          date_to: this.toDate,
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
    // tslint:disable-next-line: triple-equals
    if (typeof value == 'object') {
      const filterValue = value.name.toLowerCase();
      this.client_name = value.name;
      console.log(this.client_name);
      // Send Request
      this.api
        .get('receipts', {
          client_name: this.client_name,
          receipt_number: this.receipt_number,
          date_from: this.fromDate,
          date_to: this.toDate,
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
      return this.clientList.filter(option =>
        option.name.toLowerCase().includes(filterValue)
      );
      // tslint:disable-next-line: triple-equals
    } else if (typeof value == 'string') {
      const filterValueName = value.toLowerCase();
      const info = this.products.filter(option =>
        option.client.name.toLowerCase().includes(filterValueName)
      );
      this.dataSource = new MatTableDataSource(info);
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
      return this.clientList.filter(option =>
        option.name.toLowerCase().includes(filterValueName)
      );
    }
  }
  /* ---------------------------- Display Clients ------------------------ */
  displayClient(client): string {
    return client ? client.name : client;
  }
  /* ---------------------------- Filter Invoices ------------------------ */
  private filterInvoice(value) {
    // tslint:disable-next-line: triple-equals
    if (value == '' || value == undefined) {
      this.receipt_number = '';
      // Send Request
      this.api
        .get('receipts', {
          client_name: this.client_name,
          receipt_number: this.receipt_number,
          date_from: this.fromDate,
          date_to: this.toDate,
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
    // tslint:disable-next-line: triple-equals
    if (typeof value == 'object') {
      const filterValue = value.receipt_number;
      this.receipt_number = value.receipt_number;
      // Send Request
      this.api
        .get('receipts', {
          client_name: this.client_name,
          receipt_number: this.receipt_number,
          date_from: this.fromDate,
          date_to: this.toDate,
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
      return this.products.filter(option =>
        option.receipt_number.includes(filterValue)
      );
      // tslint:disable-next-line: triple-equals
    } else if (typeof value == 'string') {
      // value = this.tem_category;
      const filterValueName = value;
      const info = this.products.filter(option =>
        option.receipt_number.includes(filterValueName)
      );
      this.dataSource = new MatTableDataSource(info);
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
      return this.products.filter(option =>
        option.receipt_number.includes(filterValueName)
      );
    }
  }
  /* ---------------------------- Display Invoices ------------------------ */
  displayInvoice(invoice): string {
    return invoice ? invoice.receipt_number : invoice;
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
  /* ---------------------------- Data Format Change ------------------------ */
  // 1
  entryDateFrom(event, type) {
    if (event.targetElement.value) {
      this.api
        .get('receipts', {
          client_name: this.client_name,
          receipt_number: this.receipt_number,
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
      .get('receipts', {
        client_name: this.client_name,
        receipt_number: this.receipt_number,
        date_from: this.fromDate,
        date_to: this.toDate,
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
        .get('receipts', {
          client_name: this.client_name,
          receipt_number: this.receipt_number,
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
      .get('receipts', {
        client_name: this.client_name,
        receipt_number: this.receipt_number,
        date_from: this.fromDate,
        date_to: this.toDate,
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
      .get('receipts', {
        client_name: this.client_name,
        receipt_number: this.receipt_number,
        date_from: this.fromDate,
        date_to: this.toDate,
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
  /* --------------------------- Clear To Data ----------------------------- */
  getToData() {
    this.toDate = '';
    this.api
      .get('receipts', {
        client_name: this.client_name,
        receipt_number: this.receipt_number,
        date_from: this.fromDate,
        date_to: this.toDate,
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
  /* ---------------------------- Get Payment Type ------------------------ */
  getPaymentType(event) {
    this.payment_method = event;
  }
  /* ---------------------------- Open Payment ------------------------ */
  openPayment(row) {
    this.payment_id = row.id;
  }
  onSubmitPayment(form) {
    this.api
      .post('receipts/' + this.payment_id + '/pay', {
        payment_amount: form.value.paidAmount,
        payment_method: this.payment_method
      })
      .subscribe(value => {
        // tslint:disable-next-line: triple-equals
        if (value.status == 'success') {
          this.myModalPayment.hide();
          this.toast.success(
            'Thank You, you have paid ' + form.value.paidAmount + ' EGP',
            '!Success'
          );
          this.api.get('receipts', { per_page: 50 }).subscribe(data => {
            this.dataSource = new MatTableDataSource(data.data.data);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            // Sort item inside inner Object
            this.dataSource.sortingDataAccessor = (item, property) => {
              switch (property) {
                case 'client.name':
                  return item.client.name;
                default:
                  return item[property];
              }
            };
          });
        }
      });
  }
  // Reload Page
  reloadPage() {
    console.log('Reload');
  }

  /* ------------------------------ Open Inovice ----------------------- */
  openInvoice(row) {
    console.log(row);
    this.invoiceModal.show();
    this.api.get('settings', { per_page: 50 }).subscribe(data => {
      console.log(data.data);
      this.settings_address = data.data[0].address;
      this.settings_phone = data.data[0].phone;
      this.settings_website = data.data[0].website;
    });
    this.invoiceData = row;
    this.inoviceProducts = row.items[0];
    console.log(this.inoviceProducts);
    this.inoviceClient = row.client.name;
    this.inoviceEmployee = row.employee.name;
    this.inoviceBranch = row.branch.name;
    this.inoviceCity = row.branch.city.name;
    this.inoviceAddress = row.branch.address;
    this.inovicePhone = row.branch.phone;
  }

  /* ---------- Pagniation & Number of items showed in the page ------------- */
  onPaginateChange(event) {
    console.log(event);
    this.per_page = event.pageSize;
    this.api
      .get('receipts', {
        per_page: event.pageSize,
        page: 1
      })
      .subscribe((productList: any) => {
        console.log(productList);
        this.products = productList.data.data;
        this.pageIndex = productList.data.last_page;
        this.dataSource = new MatTableDataSource(productList.data.data);
        this.pageIndex = productList.data.last_page;
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sortingDataAccessor = (item, property) => {
          switch (property) {
            case 'client.name':
              return item.client.name;
            default:
              return item[property];
          }
        };
        console.log(this.pageIndex);

        this.numberOfPages = [];
        for (let i = 1; i <= this.pageIndex; i++) {
          console.log(i);
          this.numberOfPages.push(i);
          this.numberOfPages.sort(function(a, b) {
            return a - b;
          });
        }
        console.log(this.numberOfPages);
      });
  }
  selectPage(event) {
    console.log(event);
    this.currentPage = event;
    this.api
      .get('receipts', {
        per_page: this.per_page,
        page: event
      })
      .subscribe((productList: any) => {
        console.log(productList.data.data);
        this.products = productList.data.data;
        this.pageIndex = productList.data.last_page;
        this.dataSource = new MatTableDataSource(productList.data.data);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sortingDataAccessor = (item, property) => {
          switch (property) {
            case 'client.name':
              return item.client.name;
            default:
              return item[property];
          }
        };
      });
  }
  /*--------------------------------- Logout ------------------------------ */
  logout() {
    sessionStorage.removeItem('token');
    this.router.navigate(['/']);
  }
  /* ----------------------------- Print ------------------------ */
  print() {
    this.invoiceModal.show();
    setTimeout(() => {
      window.print();
    }, 200);
  }

  resetEnd() {}
}
