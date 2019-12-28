import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { MainServiceService } from '../../shared-services/main-service.service';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { startWith, map } from 'rxjs/operators';
import { ModalDirective } from 'ngx-bootstrap';
@Component({
  templateUrl: 'branches.component.html'
})
export class BranchesComponent implements OnInit {
  /* ------------------------------------- Variables ------------------------ */
  // Modals
  @ViewChild('myModal', { static: false }) public myModal: ModalDirective;
  @ViewChild('myModal2', { static: false }) public myModal2: ModalDirective;
  selection = new SelectionModel<any>(true, []);
  // Tables Colums
  displayedColumns: string[] = [
    'select',
    'id',
    'name',
    'city.name',
    'address',
    'manager',
    'employees',
    'details'
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
  // ASYNC
  filteredBranches: Observable<string[]>;
  // Arrays and Inital Variables
  hideme: any = [];
  modalError: any = [];
  branchList: any = [];
  citiesListArray: any = [];
  branchData: any = '';
  branchValue: string = '';
  cityName: any = '';
  city_id: any = '';
  deleteItem: any;
  pageEvent: any;
  pageSize: number = 50;
  per_page: number = 50;
  // Form Controls
  myControlBranch = new FormControl('');
  /* ------------------------------------- Form ------------------------ */
  // Delete Form
  deleteForm = new FormGroup({
    deleteInput: new FormControl('')
  });
  // Branch Form
  branchesForm = new FormGroup({
    id: new FormControl(''),
    name: new FormControl('', Validators.required),
    address: new FormControl('', Validators.required),
    city_id: new FormControl('', Validators.required)
  });
  /* ----------------------------------- Constructor ------------------------ */
  constructor(
    private api: MainServiceService,
    private route: ActivatedRoute,
    private toast: ToastrService
  ) {
    this.route.data.subscribe(data => {
      console.log(data);
      // Get Branches
      this.branchList = data.branches.data.data;
      this.dataSource = new MatTableDataSource(data.branches.data.data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      // Sort item inside inner Object
      this.dataSource.sortingDataAccessor = (item, property) => {
        switch (property) {
          case 'city.name':
            return item.city.name;
          case 'manager.name':
            return item.manager.name;
          default:
            return item[property];
        }
      };
      // -------------------------------------- Get Cities
      this.citiesListArray = data.cities.data;
    });
    // Filter Branches
    this.filteredBranches = this.myControlBranch.valueChanges.pipe(
      startWith(''),
      map(value => this.filterBranch(value))
    );
  }
  /* ----------------------------------- OnInit ------------------------ */
  ngOnInit() {}
  /* ---------------------------- Filter Branches ------------------------ */
  private filterBranch(value) {
    // tslint:disable-next-line: triple-equals
    if (value == '' || value == undefined) {
      this.api.get('branches', { per_page: 50 }).subscribe(data => {
        console.log(data);
        // Get Branches
        this.dataSource = new MatTableDataSource(data.data.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        // Sort item inside inner Object
        this.dataSource.sortingDataAccessor = (item, property) => {
          switch (property) {
            case 'city.name':
              return item.city.name;
            case 'manager.name':
              return item.manager.name;
            default:
              return item[property];
          }
        };
      });
    }
    // tslint:disable-next-line: triple-equals
    if (typeof value == 'object') {
      const filterValue = value.name.toLowerCase();
      // Send Request
      this.api
        .get('branches', {
          name: value.name,
          per_page: 50
        })
        // tslint:disable-next-line: no-shadowed-variable
        .subscribe(value => {
          this.dataSource = new MatTableDataSource(value.data.data);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
          // Sort item inside inner Object
          this.dataSource.sortingDataAccessor = (item, property) => {
            switch (property) {
              case 'city.name':
                return item.city.name;
              case 'manager.name':
                return item.manager.name;
              default:
                return item[property];
            }
          };
        });
      return this.branchList.filter(option =>
        option.name.toLowerCase().includes(filterValue)
      );
      // tslint:disable-next-line: triple-equals
    } else if (typeof value == 'string') {
      const filterValueName = value.toLowerCase();
      const info = this.branchList.filter(option =>
        option.name.toLowerCase().includes(filterValueName)
      );
      this.dataSource = new MatTableDataSource(info);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sortingDataAccessor = (item, property) => {
        switch (property) {
          case 'city.name':
            return item.city.name;
          case 'manager.name':
            return item.manager.name;
          default:
            return item[property];
        }
      };
      return this.branchList.filter(option =>
        option.name.toLowerCase().includes(filterValueName)
      );
    }
  }
  /* ---------------------------- Display Branches ------------------------ */
  displayBranch(branch): string {
    return branch ? branch.name : branch;
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
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach(row => this.selection.select(row));
  }
  /** The label for the checkbox on the passed row */
  checkboxLabel(row?): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${
      this.selection.isSelected(row) ? 'deselect' : 'select'
    } row ${row.position + 1}`;
  }
  /* -------------------------- Create New Branch ----------------------- */
  onSubmitBranch(form) {
    this.api.post('branches', form.value).subscribe(
      value => {
        this.toast.success(
          form.value.name + ' ' + ' has been successfully Created',
          'Success!',
          {
            timeOut: 1000
          }
        );
        this.myModal2.hide();
        this.api
          .get('branches', {
            page: 1,
            per_page: 50
          })
          .subscribe(data => {
            console.log(data.data.data);
            // Get Branches
            this.branchList = data.data.data;
            this.dataSource = new MatTableDataSource(data.data.data);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            // Sort item inside inner Object
            this.dataSource.sortingDataAccessor = (item, property) => {
              switch (property) {
                case 'city.name':
                  return item.city.name;
                case 'manager.name':
                  return item.manager.name;
                default:
                  return item[property];
              }
            };
          });
      },
      // Catch Error
      error => {
        this.modalError = error.error.errors;
        this.api.fireAlert('error', 'Please Fill All Data', '');
      }
    );
  }
  /* -------------------------- Update Branch ----------------------------- */
  onUpdateBranch(form) {
    this.api.put('branches/' + form.value.id, form.value).subscribe(
      value => {
        this.toast.success(
          form.value.name + ' ' + ' has been successfully Updated',
          'Success!',
          {
            timeOut: 1000
          }
        );
        this.myModal.hide();
        this.api
          .get('branches', {
            per_page: 50
          })
          .subscribe(data => {
            // Get Branches
            this.branchList = data.data.data;
            this.dataSource = new MatTableDataSource(data.data.data);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            // Sort item inside inner Object
            this.dataSource.sortingDataAccessor = (item, property) => {
              switch (property) {
                case 'city.name':
                  return item.city.name;
                default:
                  return item[property];
              }
            };
          });
      },
      // Catch Error
      error => {
        this.modalError = error.error.errors;
        this.api.fireAlert('error', 'Please Fill All Data', '');
      }
    );
  }
  /* ------------------------------------ Popup ----------------------------- */
  // open Update Popup
  openUpdataPopup(branchData, id) {
    this.branchData = branchData;
    this.city_id = branchData.city.id;
    this.showUpdataPopup = true;
    this.myModal.show();
    this.branchesForm.controls.id.setValue(branchData.id);
    this.branchesForm.controls.name.setValue(branchData.name);
    this.branchesForm.controls.address.setValue(branchData.address);
    this.branchesForm.controls.city_id.setValue(branchData.city.id);
    this.cityName = branchData.city.name;
  }
  // Close Update Popup
  closeUpdataPopup() {
    this.showUpdataPopup = false;
  }
  // Open Delete Popup
  opendeletePopup(row) {
    this.deleteItem = row;
    this.showDeletePopup = true;
    this.DeletingHold = true;
  }
  // Close Delete Popup
  closeDeletePopup() {
    this.deleteForm.controls.deleteInput.setValue('');
    this.showDeletePopup = false;
  }
  /* -------------------------- Delete Branch ----------------------------- */
  deleteBranch() {
    console.log('Delete Mode is ON');
    const upperDeleteInputValue = this.deleteForm.value.deleteInput;
    console.log(upperDeleteInputValue);
    if (upperDeleteInputValue === 'DELETE') {
      this.DeletingHold = true;
      this.api.delete('branches/' + this.deleteItem.id).subscribe(
        data => {
          this.DeletingHold = false;
          // tslint:disable-next-line: triple-equals
          if (data['status'] == 'success') {
            this.closeDeletePopup();
            this.toast.success(
              this.deleteItem.name + ' ' + 'has been Deleted',
              'Success!'
            );
            // tslint:disable-next-line: no-shadowed-variable
            this.api
              .get('branches', { per_page: 50 })
              // tslint:disable-next-line: no-shadowed-variable
              .subscribe(data => {
                this.dataSource = new MatTableDataSource(data.data.data);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
                // Sort item inside inner Object
                this.dataSource.sortingDataAccessor = (item, property) => {
                  switch (property) {
                    case 'city.name':
                      return item.city.name;
                    case 'manager.name':
                      return item.manager.name;
                    default:
                      return item[property];
                  }
                };
              });
          }
        },
        error => {
          this.api.fireAlert('error', error.error.message, '');
          this.closeDeletePopup();
        }
      );
    } else {
      console.log('Delete Mode is OFF');
      this.api.fireAlert('error', 'Error in writing delete', '');
    }
  }
  // Reload Page
  reloadPage() {
    console.log('Reload Popup');
  }
  /* ---------- Pagniation & Number of items showed in the page ------------- */
  onPaginateChange(event) {
    this.pageSize = event.pageSize;
    this.api
      .get('branches', {
        per_page: event.pageSize
      })
      .subscribe((value: any) => {
        console.log(value.data.data);
        this.dataSource = new MatTableDataSource(value.data.data);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sortingDataAccessor = (item, property) => {
          switch (property) {
            case 'city.name':
              return item.city.name;
            default:
              return item[property];
          }
        };
      });
  }
  /* ------------- Clear Error Message When Modal Opened ------------------ */
  clearError() {
    this.modalError = [];
  }
}
