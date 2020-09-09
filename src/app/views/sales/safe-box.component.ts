import { Component, ViewChild } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MainServiceService } from '../../shared-services/main-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
@Component({
  templateUrl: 'safe-box.component.html'
})
export class SafeBoxComponent {
  /* ------------------------------------- Variables ------------------------ */
  // Tables Colums
  selection = new SelectionModel<any>(true, []);
  displayedColumns: string[] = [
    'select',
    'client',
    'created',
    'branches.name',
    'amount',
    'status',
    'type',
    'reason'
  ];
  dataSource: MatTableDataSource<any> = new MatTableDataSource([]);
  // Sort & Pagination
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  // Arrays and Inital Variables
  data: any = '';
  pageEvent: any;
  totalSearch: any = '';
  productTransferID: any;
  per_page: number = 10;
  myControlStatus = new FormControl('');
  myControlBranch = new FormControl('');
  myControlClient = new FormControl('');
  filteredStatus: Observable<string[]>;
  filteredBranches: Observable<string[]>;
  filteredClients: Observable<string[]>;
  status: any = '';
  branch_id: any = '';
  safebox: any = [];
  toDate: any = '';
  fromDate: any = '';
  entryDate: any = [];
  branchList: any = [];
  branchValue: any = '';
  clientValue: any = '';
  pageIndex: any;
  numberOfPages: any = [];
  currentPage: 1;
  payment: any = '';
  clientsArray: any = [];
  client_id: any = '';
  /* ----------------------------------- Constructor ------------------------ */
  constructor(
    private api: MainServiceService,
    private route: ActivatedRoute,
    private toast: ToastrService,
    private router: Router
  ) {
    this.route.data.subscribe(data => {
      console.log(data);
      // Get Clients
      this.clientsArray = data.clients;
      // Filter Clients
      this.filteredClients = this.myControlClient.valueChanges.pipe(
        startWith(''),
        map(value => this.filterClient(value))
      );
      // Get Safe Box
      this.safebox = data.safeBox.data;
      this.data = Object.assign(data.safeBox.data);
      this.pageIndex = data.safeBox.data.last_page;
      // Get Branch
      this.branchList = data.branchList.data;
      this.totalSearch = data.safeBox.data.total;
      this.dataSource = new MatTableDataSource(data.safeBox.data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      // Sort item inside inner Object
      this.dataSource.sortingDataAccessor = (item, property) => {
        switch (property) {
          case 'branches.name':
            return item.branches.name;
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
  }
  /* ----------------------------------- OnInit ------------------------ */
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
      this.selection.clear();
    } else {
      this.dataSource.data.forEach(row => this.selection.select(row));
    }
  }
  /** The label for the checkbox on the passed row */
  checkboxLabel(row?): string {
    if (!row) {
      // console.log(this.flage);
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    } else {
    }
    return `${
      this.selection.isSelected(row) ? 'deselect' : 'select'
    } row ${row.position + 1}`;
  }

  /* ----------------------- Get Status ---------------------- */
  getStatus(event) {
    console.log(event);
    this.status = event;
    this.api
      .get('savebox/actions', {
        branch_id: this.branch_id,
        status: this.status,
        from_date: this.fromDate,
        to_date: this.toDate,
        payment_method: this.payment
        // per_page: 10
      })
      // tslint:disable-next-line: no-shadowed-variable
      .subscribe(value => {
        console.log(value);
        setTimeout(() => {
          this.dataSource = new MatTableDataSource(value.data);
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
  /* ----------------------- Get Payment ---------------------- */
  getPayment(event) {
    console.log(event);
    this.payment = event;
    this.api
      .get('savebox/actions', {
        branch_id: this.branch_id,
        status: this.status,
        from_date: this.fromDate,
        to_date: this.toDate,
        payment_method: this.payment
        // per_page: 10
      })
      // tslint:disable-next-line: no-shadowed-variable
      .subscribe(value => {
        console.log(value);
        setTimeout(() => {
          this.dataSource = new MatTableDataSource(value.data);
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
  /* ---------------------------- Data Format Change ------------------------ */
  // 1
  entryDateFrom(event, type) {
    if (event.targetElement.value) {
      this.api
        .get('savebox/actions', {
          branch_id: this.branch_id,
          status: this.status,
          client_id: this.client_id,
          payment_method: this.payment
          // per_page: 10
        })
        // tslint:disable-next-line: no-shadowed-variable
        .subscribe(value => {
          console.log(value);
          setTimeout(() => {
            this.dataSource = new MatTableDataSource(value.data);
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
      .get('savebox/actions', {
        branch_id: this.branch_id,
        status: this.status,
        from_date: this.fromDate,
        to_date: this.toDate,
        client_id: this.client_id,
        payment_method: this.payment
        // per_page: 10
      })
      // tslint:disable-next-line: no-shadowed-variable
      .subscribe(value => {
        setTimeout(() => {
          this.dataSource = new MatTableDataSource(value.data);
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
        .get('savebox/actions', {
          branch_id: this.branch_id,
          status: this.status,
          from_date: this.fromDate,
          client_id: this.client_id,
          to_date: this.toDate,
          payment_method: this.payment
          // per_page: 10
        })
        // tslint:disable-next-line: no-shadowed-variable
        .subscribe(value => {
          setTimeout(() => {
            this.dataSource = new MatTableDataSource(value.data);
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
      .get('savebox/actions', {
        branch_id: this.branch_id,
        status: this.status,
        from_date: this.fromDate,
        to_date: this.toDate,
        client_id: this.client_id,
        payment_method: this.payment
        // per_page: 10
      })
      // tslint:disable-next-line: no-shadowed-variable
      .subscribe(value => {
        setTimeout(() => {
          this.dataSource = new MatTableDataSource(value.data);
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

  // ----------------------------------------- Filter Branches
  private filterBranch(value) {
    // tslint:disable-next-line: triple-equals
    if (value == '' || value == undefined) {
      this.branch_id = '';
      // Send Request
      this.api
        .get('savebox/actions', {
          branch_id: this.branch_id,
          status: this.status,
          client_id: this.client_id,
          payment_method: this.payment
          // from_date: this.fromDate,
          // to_date: this.toDate,
          // per_page: 10
        })
        // tslint:disable-next-line: no-shadowed-variable
        .subscribe(value => {
          console.log(value);
          setTimeout(() => {
            this.dataSource = new MatTableDataSource(value.data);
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
        .get('savebox/actions', {
          branch_id: this.branch_id,
          client_id: this.client_id,
          status: this.status,
          payment_method: this.payment
          // from_date: this.fromDate,
          // to_date: this.toDate,
          // per_page: 10
        })
        // tslint:disable-next-line: no-shadowed-variable
        .subscribe(value => {
          console.log(value);
          setTimeout(() => {
            this.dataSource = new MatTableDataSource(value.data);
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
      const info = this.safebox.filter(option =>
        option.branches.name.toLowerCase().includes(filterValueName)
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
  // ----------------------------------------- Filter Branches
  private filterClient(value) {
    // tslint:disable-next-line: triple-equals
    if (value == '' || value == undefined) {
      this.client_id = '';
      // Send Request
      this.api
        .get('savebox/actions', {
          branch_id: this.branch_id,
          status: this.status,
          payment_method: this.payment,
          client_id: this.client_id
          // from_date: this.fromDate,
          // to_date: this.toDate,
          // per_page: 10
        })
        // tslint:disable-next-line: no-shadowed-variable
        .subscribe(value => {
          console.log(value);
          setTimeout(() => {
            this.dataSource = new MatTableDataSource(value.data);
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
      this.client_id = value.id;
      console.log(this.branch_id);
      // Send Request
      this.api
        .get('savebox/actions', {
          branch_id: this.branch_id,
          status: this.status,
          client_id: this.client_id,
          payment_method: this.payment
          // from_date: this.fromDate,
          // to_date: this.toDate,
          // per_page: 10
        })
        // tslint:disable-next-line: no-shadowed-variable
        .subscribe(value => {
          console.log(value);
          setTimeout(() => {
            this.dataSource = new MatTableDataSource(value.data);
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
      return this.clientsArray.filter(option =>
        option.name.toLowerCase().includes(filterValue)
      );
      // tslint:disable-next-line: triple-equals
    } else if (typeof value == 'string') {
      const filterValueName = value.toLowerCase();
      const info = this.clientsArray.filter(option =>
        option.name.toLowerCase().includes(filterValueName)
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
      return this.clientsArray.filter(option =>
        option.name.toLowerCase().includes(filterValueName)
      );
    }
  }
  // ----------------------------------------- Display Branches
  displayClient(client): string {
    console.log(client);
    return client ? client.name : client;
  }
  /* --------------------------- Clear From Data ----------------------------- */
  getFromData() {
    this.fromDate = '';
    this.api
      .get('savebox/actions', {
        branch_id: this.branch_id,
        status: this.status,
        from_date: this.fromDate,
        to_date: this.toDate,
        payment_method: this.payment
        // per_page: 10
      })
      // tslint:disable-next-line: no-shadowed-variable
      .subscribe(value => {
        console.log(value);
        setTimeout(() => {
          this.dataSource = new MatTableDataSource(value.data);
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
  /* --------------------------- Clear To Data ----------------------------- */
  getToData() {
    this.toDate = '';
    this.api
      .get('savebox/actions', {
        branch_id: this.branch_id,
        status: this.status,
        from_date: this.fromDate,
        to_date: this.toDate,
        payment_method: this.payment
        // per_page: 10
      })
      // tslint:disable-next-line: no-shadowed-variable
      .subscribe(value => {
        console.log(value);
        setTimeout(() => {
          this.dataSource = new MatTableDataSource(value.data);
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
  /* ---------- Pagniation & Number of items showed in the page ------------- */
  onPaginateChange(event) {
    console.log(event);
    // this.per_page = event.pageSize;
    // this.api
    //   .get('savebox/actions', {
    //     per_page: event.pageSize,
    //     page: 1
    //   })
    //   .subscribe((productList: any) => {
    //     console.log(productList);
    //     this.pageIndex = productList.data.last_page;
    //     this.dataSource = new MatTableDataSource(productList.data.data);
    //     this.pageIndex = productList.data.last_page;
    //     this.dataSource.sort = this.sort;
    //     this.dataSource.paginator = this.paginator;
    //     this.dataSource.sortingDataAccessor = (item, property) => {
    //       switch (property) {
    //         case 'branches.name':
    //           return item.branches.name;
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
    this.currentPage = event;
    // this.api
    //   .get('savebox/actions', {
    //     per_page: this.per_page,
    //     page: event
    //   })
    //   .subscribe((productList: any) => {
    //     console.log(productList.data.data);
    //     this.pageIndex = productList.data.last_page;
    //     this.dataSource = new MatTableDataSource(productList.data.data);
    //     this.dataSource.sort = this.sort;
    //     this.dataSource.paginator = this.paginator;
    //     this.dataSource.sortingDataAccessor = (item, property) => {
    //       switch (property) {
    //         case 'branches.name':
    //           return item.branches.name;
    //         default:
    //           return item[property];
    //       }
    //     };
    //   });
  }
  /*--------------------------------- Logout ------------------------------ */
  logout() {
    sessionStorage.removeItem('token');
    this.router.navigate(['/']);
  }
}
