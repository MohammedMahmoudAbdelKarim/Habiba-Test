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
import { ModalDirective } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
@Component({
  templateUrl: 'transfer.component.html'
})
export class TransferComponent implements OnInit {
  /* ----------------------------------- Variables ---------------------- */
  // Modals
  @ViewChild('myModal', { static: false }) public myModal: ModalDirective;
  @ViewChild('myModalImg', { static: false }) public myModalImg: ModalDirective;
  @ViewChild('reqModel', { static: false }) public reqModel: ModalDirective;
  // Tables Colums
  selection = new SelectionModel<any>(true, []);
  displayedColumns: string[] = [
    'select',
    'id',
    'product.label',
    'from_branch.name',
    'product.item_total_after_profit',
    'created',
    'employee.name',
    'img'
    // 'actions'
  ];
  dataSource: MatTableDataSource<any> = new MatTableDataSource([]);
  // Sort & Pagination
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  // Boolean
  flage: boolean = false;
  // ASYNC
  filteredBranches: Observable<string[]>;
  // Arrays and Inital Variables
  hideme: any = [];
  products: any = [];
  items: any = [];
  modalError: any = [];
  branchList: any = [];
  branch_id: any = '';
  label: any = '';
  totalSearch: any = '';
  branchValue: any = '';
  imgSrc: any = '';
  transferName: any = '';
  data: any;
  pageEvent: any;
  checkedItems: any = 0;
  productTransferID = '';
  per_page: number = 50;
  pageIndex: any;
  numberOfPages: any = [];
  currentPage: any = 1;
  myControlCode = new FormControl('');
  codeValue: any = '';
  filteredCodes: Observable<string[]>;

  // Form Controls
  myControlBranch = new FormControl('');
  // Transfer Form
  transferForm = new FormGroup({
    branch_id: new FormControl('', Validators.required)
  });
  /* ----------------------------------- Constructor ------------------------ */
  constructor(
    private api: MainServiceService,
    private route: ActivatedRoute,
    private router: Router,
    private toast: ToastrService
  ) {
    this.route.data.subscribe(data => {
      console.log(data);
      // Get Branches
      this.branchList = data.branchList.data;
      // Get Products
      this.items = data.productsData.data;
      console.log('Products -> ', data.productsData.data);
      // Get Transfers
      this.products = data.transfers.data.data;
      console.log('Transfered Products -> ', data.transfers.data.data);
      this.data = Object.assign(data.transfers.data);
      this.totalSearch = data.transfers.data.total;
      this.pageIndex = data.transfers.data.last_page;
      this.dataSource = new MatTableDataSource(data.transfers.data.data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      // Sort item inside inner Object
      this.dataSource.sortingDataAccessor = (item, property) => {
        switch (property) {
          case 'product.label':
            return item.product.label;
          case 'from_branch.name':
            return item.from_branch.name;
          case 'product.item_total_after_profit':
            return item.product.item_total_after_profit;
          case 'employee.name':
            return item.employee.name;
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
    // Filter Codes
    this.filteredCodes = this.myControlCode.valueChanges.pipe(
      startWith(''),
      map(value => this.fitlerCode(value))
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
  /* ---------------------------- Filter Branches ------------------------ */
  private filterBranch(value) {
    // tslint:disable-next-line: triple-equals
    if (value == '' || value == undefined) {
      this.branch_id = '';
      // Send Request
      this.api
        .get('transfer', {})
        // tslint:disable-next-line: no-shadowed-variable
        .subscribe(value => {
          console.log('Empty Branch -> ', value);
          setTimeout(() => {
            this.dataSource = new MatTableDataSource(value.data.data);
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
            // Sort item inside inner Object
            this.dataSource.sortingDataAccessor = (item, property) => {
              switch (property) {
                case 'product.label':
                  return item.product.label;
                case 'from_branch.name':
                  return item.from_branch.name;
                case 'product.item_total_after_profit':
                  return item.product.item_total_after_profit;
                case 'employee.name':
                  return item.employee.name;
                default:
                  return item[property];
              }
            };
          }, 300);
        });
    }
    // tslint:disable-next-line: triple-equals
    if (typeof value == 'object') {
      const filterValue = value.to_branch.name.toLowerCase();
      this.label = value.product.label;
      // Send Request
      this.api
        .get('transfer', {
          label: this.label
        })
        // tslint:disable-next-line: no-shadowed-variable
        .subscribe(value => {
          console.log('Filtered Branch -> ', value.data.data);
          setTimeout(() => {
            this.dataSource = new MatTableDataSource(value.data.data);
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
            // Sort item inside inner Object
            this.dataSource.sortingDataAccessor = (item, property) => {
              switch (property) {
                case 'product.label':
                  return item.product.label;
                case 'from_branch.name':
                  return item.from_branch.name;
                case 'product.item_total_after_profit':
                  return item.product.item_total_after_profit;
                case 'employee.name':
                  return item.employee.name;
                default:
                  return item[property];
              }
            };
          }, 300);
        });
      return this.products.filter(option =>
        option.to_branch.name.toLowerCase().includes(filterValue)
      );
      // tslint:disable-next-line: triple-equals
    } else if (typeof value == 'string') {
      const filterValueName = value.toLowerCase();
      const filterValueCode = value.toLowerCase();
      const filterValueDate = value;
      const info = this.products.filter(
        option =>
          option.to_branch.name.toLowerCase().includes(filterValueName) ||
          option.product.label.toLowerCase().includes(filterValueCode) ||
          option.created.includes(filterValueDate)
      );
      this.dataSource = new MatTableDataSource(info);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      // Sort item inside inner Object
      this.dataSource.sortingDataAccessor = (item, property) => {
        switch (property) {
          case 'product.label':
            return item.product.label;
          case 'from_branch.name':
            return item.from_branch.name;
          case 'product.item_total_after_profit':
            return item.product.item_total_after_profit;
          case 'employee.name':
            return item.employee.name;
          default:
            return item[property];
        }
      };
      return this.products.filter(option =>
        option.to_branch.name.toLowerCase().includes(filterValueName)
      );
    }
  }
  /* ---------------------------- Display Branches ------------------------ */
  displayBranch(branch): string {
    return branch ? branch.product.label : branch;
  }
  /* ---------------------------- Filter Codes ------------------------ */
  private fitlerCode(value) {
    // tslint:disable-next-line: triple-equals
    if (value == '' || value == undefined) {
      this.label = '';
      // Send Request
      this.api
        .get('products')
        // tslint:disable-next-line: no-shadowed-variable
        .subscribe(value => {
          console.log('Empty Branch -> ', value.data);
          setTimeout(() => {}, 300);
        });
    }
    // tslint:disable-next-line: triple-equals
    if (typeof value == 'object') {
      const filterValue = value.label.toLowerCase();
      this.label = value.label;
      // Send Request
      this.api
        .get('products', {
          label: this.label
        })
        // tslint:disable-next-line: no-shadowed-variable
        .subscribe(value => {
          console.log('Filtered Code -> ', value.data);

          console.log(value.data[0]);
          this.transferName = value.data[0].branch.name;
          this.productTransferID = value.data[0].id;
          setTimeout(() => {}, 300);
        });
      return this.items.filter(option =>
        option.label.toLowerCase().includes(filterValue)
      );
      // tslint:disable-next-line: triple-equals
    } else if (typeof value == 'string') {
      this.api
        .get('products', {
          label: value
        })
        .subscribe(value => {
          console.log('Filtered Code (String) -> ', value);
        });
      // value = this.tem_category;
      const filterValueName = value.toLowerCase();
      const info = this.items.filter(option =>
        option.label.toLowerCase().includes(filterValueName)
      );
      // Sort item inside inner Object
      return this.items.filter(option =>
        option.label.toLowerCase().includes(filterValueName)
      );
    }
  }
  displayCode(code): string {
    console.log(code);
    return code ? code.label : code;
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
  }
  /** The label for the checkbox on the passed row */
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
  /* ---------------------------- Open Request ------------------------------ */
  openReq(modal) {
    console.log(modal);
    this.reqModel.show();
  }
  /* -------------------------- Transfer Action ---------------------------- */
  onSubmitTransfer(form) {
    this.api
      .put('branches/' + form.value.branch_id + '/transfer', {
        product_id: this.productTransferID
      })
      .subscribe(val => {
        this.toast.success(
          'The product has been successfully transfered',
          '!Success'
        );
      });
    this.reqModel.hide();
    this.api
      .get('transfer', {
        per_page: 50
      })
      // tslint:disable-next-line: no-shadowed-variable
      .subscribe(value => {
        setTimeout(() => {
          console.log(
            'Transfer Items After transfer request -> ',
            value.data.data
          );
          this.dataSource = new MatTableDataSource(value.data.data);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
          // Sort item inside inner Object
          this.dataSource.sortingDataAccessor = (item, property) => {
            switch (property) {
              case 'product.label':
                return item.product.label;
              case 'from_branch.name':
                return item.from_branch.name;
              case 'product.item_total_after_profit':
                return item.product.item_total_after_profit;
              case 'employee.name':
                return item.employee.name;
              default:
                return item[property];
            }
          };
        }, 300);
      });
  }

  /* -------------------------- Open Image Modal ---------------------------- */
  openImage(event) {
    this.myModalImg.show();
    this.imgSrc = event.src;
  }
  /* ---------- Pagniation & Number of items showed in the page ------------- */
  onPaginateChange(event) {
    console.log(event);
    // this.api
    //   .get('transfer', {
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
    //         case 'from_branch.name':
    //           return item.from_branch.name;
    //         case 'product.item_total_after_profit':
    //           return item.product.item_total_after_profit;
    //         case 'employee.name':
    //           return item.employee.name;
    //         default:
    //           return item[property];
    //       }
    //     };
    //   });
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
  }
  selectPage(event) {
    console.log(event);
    // this.currentPage = event;
    // this.api
    //   .get('transfer', {
    //     per_page: 10,
    //     page: this.currentPage
    //   })
    //   .subscribe((productList: any) => {
    //     console.log(productList.data.data);
    //     this.products = productList.data.data;
    //     this.dataSource = new MatTableDataSource(productList.data.data);
    //     this.pageIndex = productList.data.last_page;
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
  /*--------------------------------- Logout -------------------------------- */
  logout() {
    sessionStorage.removeItem('token');
    this.router.navigate(['/']);
  }
}
