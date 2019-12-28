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
import { ModalDirective } from 'ngx-bootstrap';
@Component({
  templateUrl: 'transfer.component.html'
})
export class TransferComponent implements OnInit {
  /* ----------------------------------- Variables ---------------------- */
  // Modals
  @ViewChild('myModal', { static: false }) public myModal: ModalDirective;
  @ViewChild('myModalImg', { static: false }) public myModalImg: ModalDirective;
  // Tables Colums
  selection = new SelectionModel<any>(true, []);
  displayedColumns: string[] = [
    'select',
    'id',
    'product.label',
    'from_branch.name',
    'product.gold_total',
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
  showDetailsPopup: boolean = false;
  showUpdataPopup: boolean = false;
  showDeletePopup: boolean = false;
  DeletingHold: boolean = false;
  deleteFlage: boolean = false;
  flage: boolean = false;
  // ASYNC
  filteredBranches: Observable<string[]>;
  filteredCategories: Observable<string[]>;
  filteredCodes: Observable<string[]>;
  filteredStatus: Observable<string[]>;
  // Arrays and Inital Variables
  hideme: any = [];
  products: any = [];
  statusList: any = [];
  pageNumbers: any = [];
  categoryList: any = [];
  modalError: any = [];
  productNumbersList: any = [];
  baseUrl: string = 'http://jewelry.ixscope.com/backend/img/products/';
  imgUrl: string = 'img/products/';
  category_id: any = '';
  branch_id: any = '';
  status_id: any = '';
  label: any = '';
  stockData: any = '';
  transferCode: any = '';
  transferName: any = '';
  totalSearch: any = '';
  branchValue: any = '';
  imgSrc: any = '';
  branchList: any;
  deleteItem: any;
  data: any;
  pageEvent: any;
  productTransferID: any;
  checkedItems: any = 0;
  per_page: number = 50;
  // Form Controls
  myControlBranch = new FormControl('');
  myControlCategory = new FormControl('');
  myControlCode = new FormControl('');
  myControlStatus = new FormControl('');
  /* ----------------------------------- Form ------------------------ */
  // Delete Form
  deleteForm = new FormGroup({
    deleteInput: new FormControl('')
  });
  // Transfer Form
  transferForm = new FormGroup({
    branch_id: new FormControl('', Validators.required)
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
      // Get Transfers
      this.products = data.transfers.data.data;
      this.data = Object.assign(data.transfers.data.data);
      this.totalSearch = data.transfers.data.total;
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
          case 'product.gold_total':
            return item.product.gold_total;
          case 'employee.name':
            return item.employee.name;
          default:
            return item[property];
        }
      };
      // Get Status
      this.statusList = data.statusList.data;
    });
    // Filter Branches
    this.filteredBranches = this.myControlBranch.valueChanges.pipe(
      startWith(''),
      map(value => this.filterBranch(value))
    );
  }
  /* ----------------------------------- OnInit ------------------------ */
  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  /* ---------------------------- Filter Branches ------------------------ */
  private filterBranch(value) {
    // tslint:disable-next-line: triple-equals
    if (value == '' || value == undefined) {
      this.route.data.subscribe(data => {
        this.branch_id = '';
        // Send Request
        this.api
          .get('transfer', {
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
                  case 'product.label':
                    return item.product.label;
                  case 'from_branch.name':
                    return item.from_branch.name;
                  case 'product.gold_total':
                    return item.product.gold_total;
                  case 'employee.name':
                    return item.employee.name;
                  default:
                    return item[property];
                }
              };
            }, 300);
          });
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
                case 'product.gold_total':
                  return item.product.gold_total;
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
          case 'product.gold_total':
            return item.product.gold_total;
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
  /* ---------------------------- Remove Multi-Items ----------------------- */
  mutliplyAction(event) {
    this.flage = event.checked;
    this.checkedItems = this.selection.selected.length;
  }
  removeMultiply() {
    const upperDeleteInputValue = this.deleteForm.value.deleteInput;
    this.showDeletePopup = true;
    this.deleteFlage = true;
    if (upperDeleteInputValue === 'DELETE') {
      const ids = [];
      this.selection.selected.forEach(item => {
        const index: number = this.data.findIndex(d => d === item);
        ids.push(item.id);
      });
      this.checkedItems = 0;
      this.selection.clear();
      this.api
        .delete('products', { params: { 'ids[]': ids } })
        .subscribe(data => {
          this.toast.success('The Items are Successfully delete', '!Success');
          this.api.get('products').subscribe(value => {
            this.dataSource = new MatTableDataSource(value.data.data);
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
            // Sort item inside inner Object
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
        });
      this.showDeletePopup = false;
    }
  }
  /* -------------------------- Open Image Modal ---------------------------- */
  openImage(event) {
    this.myModalImg.show();
    this.imgSrc = event.src;
  }
  /* ---------- Pagniation & Number of items showed in the page ------------- */
  onPaginateChange(event) {
    this.api
      .get('transfer', {
        per_page: event.pageSize
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
              case 'product.label':
                return item.product.label;
              case 'from_branch.name':
                return item.from_branch.name;
              case 'product.gold_total':
                return item.product.gold_total;
              case 'employee.name':
                return item.employee.name;
              default:
                return item[property];
            }
          };
        }, 300);
      });
  }
  /*--------------------------------- Logout -------------------------------- */
  logout() {
    sessionStorage.removeItem('token');
    this.router.navigate(['/']);
  }
}
