import { MainServiceService } from './../../shared-services/main-service.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
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
  flage: boolean = false;
  // ASYNC
  filteredBranches: Observable<string[]>;
  // Arrays and Inital Variables
  hideme: any = [];
  products: any = [];
  modalError: any = [];
  branch_id: any = '';
  label: any = '';
  totalSearch: any = '';
  branchValue: any = '';
  imgSrc: any = '';
  data: any;
  pageEvent: any;
  checkedItems: any = 0;
  per_page: number = 50;
  // Form Controls
  myControlBranch = new FormControl('');
  /* ----------------------------------- Constructor ------------------------ */
  constructor(
    private api: MainServiceService,
    private route: ActivatedRoute,
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
