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
  templateUrl: 'stones.component.html'
})
export class StonesComponent implements OnInit {
  /* ------------------------------------- Variables ------------------------ */
  // Modals
  @ViewChild('myModal', { static: false }) public myModal: ModalDirective;
  @ViewChild('myModal2', { static: false }) public myModal2: ModalDirective;
  @ViewChild('deleteModal', { static: false })
  public deleteModal: ModalDirective;
  // Tables Colums
  displayedColumns: string[] = [
    'select',
    'id',
    'name',
    'code',
    'price',
    'setting',
    'details'
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
  // ASYNC
  filteredstones: Observable<string[]>;
  // Arrays and Inital Variables
  hideme: any = [];
  modalError: any = [];
  stonesList: any = [];
  stoneList: any = [];
  stoneData: any = '';
  stoneValue: string = '';
  deleteItem: any;
  pageEvent: any;
  pageSize: number = 50;
  per_page: number = 50;
  // Form Controls
  myControlstone = new FormControl('');
  /* ------------------------------------- Form ------------------------ */
  // Delete Form
  deleteForm = new FormGroup({
    deleteInput: new FormControl('')
  });
  // Stone Form
  stonesForm = new FormGroup({
    id: new FormControl(''),
    name: new FormControl('', Validators.required),
    code: new FormControl('', Validators.required),
    price: new FormControl('', Validators.required),
    setting: new FormControl('', Validators.required)
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
      // Get Stones
      this.stoneList = data.stones.data.data;
      this.dataSource = new MatTableDataSource(data.stones.data.data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
    // Filter Stones
    this.filteredstones = this.myControlstone.valueChanges.pipe(
      startWith(''),
      map(value => this.filterstone(value))
    );
  }
  /* ----------------------------------- OnInit ------------------------ */
  ngOnInit() {}
  /* ---------------------------- Filter Stones ------------------------ */
  private filterstone(value) {
    // tslint:disable-next-line: triple-equals
    if (value == '' || value == undefined) {
      this.api.get('stones', { per_page: 50 }).subscribe(data => {
        // Get Stones
        this.dataSource = new MatTableDataSource(data.data.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
    }
    // tslint:disable-next-line: triple-equals
    if (typeof value == 'object') {
      const filterValue = value.name.toLowerCase();
      // Send Request
      this.api
        .get('stones', {
          name: value.name,
          per_page: 50
        })
        // tslint:disable-next-line: no-shadowed-variable
        .subscribe(value => {
          this.dataSource = new MatTableDataSource(value.data.data);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
        });
      return this.stoneList.filter(option =>
        option.name.toLowerCase().includes(filterValue)
      );
      // tslint:disable-next-line: triple-equals
    } else if (typeof value == 'string') {
      const filterValueName = value.toLowerCase();
      const info = this.stoneList.filter(option =>
        option.name.toLowerCase().includes(filterValueName)
      );
      this.dataSource = new MatTableDataSource(info);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      return this.stoneList.filter(option =>
        option.name.toLowerCase().includes(filterValueName)
      );
    }
  }
  /* ---------------------------- Display Stones ------------------------ */
  displaystone(stone): string {
    return stone ? stone.name : stone;
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

  /* -------------------------- Create New Stones ----------------------- */
  onSubmitstone(form) {
    this.api.post('stones', form.value).subscribe(
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
          .get('stones', {
            per_page: 50
          })
          .subscribe(data => {
            // Get Stones
            this.stoneList = data.data.data;
            this.dataSource = new MatTableDataSource(data.data.data);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          });
      },
      // Catch Error
      error => {
        console.log(error.error);
        this.modalError = error.error.errors;
        this.api.fireAlert('error', 'Please Fill All Data', '');
      }
    );
  }
  /* -------------------------- Update Stones ----------------------------- */
  onUpdatestone(form) {
    this.api.put('stones/' + form.value.id, form.value).subscribe(
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
          .get('stones', {
            per_page: 50
          })
          .subscribe(data => {
            // Get Stones
            this.stoneList = data.data.data;
            this.dataSource = new MatTableDataSource(data.data.data);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          });
      },
      // Catch Error
      error => {
        console.log(error.error);
        this.modalError = error.error.errors;
        this.api.fireAlert('error', 'Please Fill All Data', '');
      }
    );
  }
  /* ------------------------------------ Popup ----------------------------- */
  // open Update Popup
  openUpdataPopup(stoneData, id) {
    this.stoneData = stoneData;
    this.showUpdataPopup = true;
    this.myModal.show();
    this.stonesForm.controls.id.setValue(stoneData.id);
    this.stonesForm.controls.name.setValue(stoneData.name);
    this.stonesForm.controls.code.setValue(stoneData.code);
    this.stonesForm.controls.price.setValue(stoneData.price);
    this.stonesForm.controls.setting.setValue(stoneData.setting);
  }
  // Open Delete Popup
  opendeletePopup(row) {
    console.log(row);
    this.deleteItem = row;
    this.deleteForm.controls.deleteInput.setValue('');
    this.deleteModal.show();
  }
  /* -------------------------- Delete Stone ----------------------------- */
  deleteStone() {
    const upperDeleteInputValue = this.deleteForm.value.deleteInput;
    console.log(upperDeleteInputValue);
    if (upperDeleteInputValue === 'DELETE') {
      this.api.delete('stones/' + this.deleteItem.id).subscribe(
        data => {
          // tslint:disable-next-line: triple-equals
          if (data['status'] == 'success') {
            this.deleteModal.hide();
            this.toast.success(
              this.deleteItem.name + ' ' + 'has been Deleted',
              'Success!'
            );
            // tslint:disable-next-line: no-shadowed-variable
            this.api
              .get('stones', { page: 1, per_page: 50 })
              // tslint:disable-next-line: no-shadowed-variable
              .subscribe(data => {
                this.stoneList = data.data.data;
                this.dataSource = new MatTableDataSource(data.data.data);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
              });
          }
        },
        // Catch Error
        error => {
          console.log(error.error);
          this.api.fireAlert('error', error.error.message, '');
        }
      );
    } else {
      this.api.fireAlert('error', 'Error in writing "DELETE"', '');
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
      .get('stones', {
        per_page: event.pageSize
      })
      .subscribe((value: any) => {
        console.log(value.data.data);
        this.dataSource = new MatTableDataSource(value.data.data);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      });
  }
  /* ------------- Clear Error Message When Modal Opened ------------------ */
  clearError() {
    this.modalError = [];
  }
  /*--------------------------------- Logout ------------------------------ */
  logout() {
    sessionStorage.removeItem('token');
    this.router.navigate(['/']);
  }
}
