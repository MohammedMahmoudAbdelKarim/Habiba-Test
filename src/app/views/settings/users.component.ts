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
import Swal from 'sweetalert2';
@Component({
  templateUrl: 'users.component.html'
})
export class UsersComponent implements OnInit {
  /* ------------------------------------- Variables ------------------------ */
  // Modals
  @ViewChild('myModal', { static: false }) public myModal: ModalDirective;
  @ViewChild('myModal2', { static: false }) public myModal2: ModalDirective;
  @ViewChild('deleteModal', { static: false })
  public deleteModal: ModalDirective;
  @ViewChild('delete2Modal', { static: false })
  public delete2Modal: ModalDirective;
  // Tables Colums
  displayedColumns: string[] = [
    'select',
    'id',
    'name',
    'role',
    'is_active',
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
  flage: boolean = false;
  // ASYNC
  filteredRoles: Observable<string[]>;
  // Arrays and Inital Variables
  hideme: any = [];
  pageNumbers: any = [];
  modalError: any = [];
  stonesList: any = [];
  codeList: any;
  tem_category: any = '';
  userList: any = [];
  stone_id: any = '';
  deleteItem: any;
  citiesListArray: any;
  label: any = '';
  userData: any = '';
  stoneValue: string = '';
  categoryValue: string = '';
  codeValue: string = '';
  statusValue: string = '';
  imgUrl: string = 'img/products/';
  baseUrl: string = 'http://jewelry.ixscope.com/backend/img/products/';
  roleValue: any = '';
  data: any;
  pageEvent: any;
  pageSize: number = 50;
  per_page: number = 50;
  checkedItems: any = 0;
  // Form Controls
  myControlrole = new FormControl('');
  /* ----------------------------------- Form ------------------------ */
  // Delete Form
  deleteForm = new FormGroup({
    deleteInput: new FormControl('')
  });
  // User Form
  userForm = new FormGroup({
    id: new FormControl(''),
    name: new FormControl('', Validators.required),
    mobile: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
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
      // Get Users
      this.userList = data.user.data.data;
      this.dataSource = new MatTableDataSource(data.user.data.data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.data = Object.assign(data.user.data.data);
    });
    // Filter Role
    this.filteredRoles = this.myControlrole.valueChanges.pipe(
      startWith(''),
      map(value => this.filterRole(value))
    );
  }
  /* ----------------------------------- OnInit ------------------------ */
  ngOnInit() {}
  /* ---------------------------- Filter Role ------------------------ */
  private filterRole(value) {
    // tslint:disable-next-line: triple-equals
    if (value == '' || value == undefined) {
      this.api
        .get('employees/index', {
          per_page: 50
        })
        .subscribe(data => {
          // Get Users
          this.dataSource = new MatTableDataSource(data.data.data);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        });
    }
    // tslint:disable-next-line: triple-equals
    if (typeof value == 'object') {
      const filterValue = value.name.toLowerCase();
      const filterNumber = value.mobile;
      // Send Request
      this.api
        .get('employees/index', {
          per_page: 50,
          name: value.name
        })
        // tslint:disable-next-line: no-shadowed-variable
        .subscribe(value => {
          this.dataSource = new MatTableDataSource(value.data.data);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
        });
      return this.userList.filter(
        option =>
          option.name.toLowerCase().includes(filterValue) ||
          option.mobile.includes(filterNumber)
      );
      // tslint:disable-next-line: triple-equals
    } else if (typeof value == 'string') {
      const filterValueName = value.toLowerCase();
      const filterNumber = value;
      const filterRole = value.toLowerCase();
      const info = this.userList.filter(
        option =>
          option.name.toLowerCase().includes(filterValueName) ||
          option.mobile.includes(filterNumber) ||
          option.role.toLowerCase().includes(filterRole)
      );
      this.dataSource = new MatTableDataSource(info);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      return this.userList.filter(option =>
        option.name.toLowerCase().includes(filterValueName)
      );
    }
  }
  /* ---------------------------- Display User ------------------------ */
  displayuser(user): string {
    return user ? user.name : user;
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
    if (upperDeleteInputValue === 'DELETE') {
      const ids = [];
      this.selection.selected.forEach(item => {
        const index: number = this.data.findIndex(d => d === item);
        ids.push(item.id);
      });
      this.checkedItems = 0;
      this.selection.clear();
      this.api
        .delete('employees', { params: { 'ids[]': ids } })
        .subscribe(data => {
          this.toast.success('The Items are Successfully delete', '!Success');
          this.api.get('employees/index', { per_page: 50 }).subscribe(value => {
            this.dataSource = new MatTableDataSource(value.data.data);
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
          });
        });
    } else {
      this.api.fireAlert('error', 'Error in writing "DELETE"', '');
    }
  }
  /* ------------------------------------ Popup ----------------------------- */
  // Open Update Popup
  openUpdataPopup(UserData, id) {
    this.userData = UserData;
    this.showUpdataPopup = true;
    this.myModal.show();
    this.userForm.controls.id.setValue(UserData.id);
    this.userForm.controls.name.setValue(UserData.name);
    this.userForm.controls.mobile.setValue(UserData.mobile);
    this.userForm.controls.email.setValue(UserData.email);
  }
  // Close Update Popup
  closeUpdataPopup() {
    this.showUpdataPopup = false;
    this.modalError = [];
  }
  // Open Delete Popup
  opendeletePopup(row) {
    console.log(row);
    this.deleteItem = row;
    this.deleteForm.controls.deleteInput.setValue('');
    this.deleteModal.show();
  }
  // Open Multi Delete
  deleteMultiply() {
    this.deleteForm.controls.deleteInput.setValue('');
    this.delete2Modal.show();
  }
  /* -------------------------- Delete Item ----------------------------- */
  deleteUser() {
    const upperDeleteInputValue = this.deleteForm.value.deleteInput;
    if (upperDeleteInputValue === 'DELETE') {
      this.api.delete('employees/' + this.deleteItem.id).subscribe(value => {
        // tslint:disable-next-line: triple-equals
        if (value['status'] == 'success') {
          this.toast.success(
            this.deleteItem.name + ' ' + 'has been Deleted',
            'Success!'
          );
          this.deleteModal.hide();
          this.api
            .get('employees/index', {
              per_page: 50
            })
            // tslint:disable-next-line: no-shadowed-variable
            .subscribe(value => {
              this.dataSource = new MatTableDataSource(value.data.data);
              this.dataSource.paginator = this.paginator;
              this.dataSource.sort = this.sort;
            });

          this.api
            .get('employees/index', {
              per_page: 50
            })
            // tslint:disable-next-line: no-shadowed-variable
            .subscribe(value => {});
        }
      });
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
      .get('employees/index', {
        per_page: event.pageSize
      })
      .subscribe((productList: any) => {
        this.dataSource = new MatTableDataSource(productList.data.data);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      });
  }
  /* --------------------- Clear Error When Model Opened -------------------- */
  clearError() {
    this.modalError = [];
  }
  /* ------------------------- Change Status -------------------- */
  changeStatus(row) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'you want to change this status',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#373737',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Change'
    }).then(result => {
      if (result.value) {
        this.api
          .post('employees/make-active', {
            id: row.id,
            status: row.is_active
          })
          .subscribe(value => {
            this.api
              .get('employees/index', {
                per_page: 50
              })
              // tslint:disable-next-line: no-shadowed-variable
              .subscribe(value => {
                this.dataSource = new MatTableDataSource(value.data.data);
                this.dataSource.sort = this.sort;
                this.dataSource.paginator = this.paginator;
              });
          });
      }
    });
  }
  /* ------------------------- Update User -------------------- */
  onUpdateuser(form) {
    this.api.put('employees/' + form.value.id, form.value).subscribe(
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
          .get('employees/index', {
            per_page: 50
          })
          .subscribe(data => {
            // Get User
            this.userList = data.data.data;
            this.dataSource = new MatTableDataSource(data.data.data);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          });
      },
      error => {
        this.modalError = error.error.errors;
        this.api.fireAlert('error', 'Please Fill All Data', '');
      }
    );
  }
  /* ------------------------- Create User -------------------- */
  onSubmitform(form) {
    this.api.post('employees', form.value).subscribe(
      value => {
        console.log(value);
        this.toast.success(
          form.value.name + ' ' + ' has been successfully Updated',
          'Success!',
          {
            timeOut: 1000
          }
        );
        this.myModal2.hide();
        this.api
          .get('employees/index', {
            per_page: 50
          })
          .subscribe(data => {
            // Get User
            this.userList = data.data.data;
            this.dataSource = new MatTableDataSource(data.data.data);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          });
      },
      error => {
        this.modalError = error.error.errors;
        this.api.fireAlert('error', 'Please Fill All Data', '');
      }
    );
  }
  /*--------------------------------- Logout ------------------------------ */
  logout() {
    sessionStorage.removeItem('token');
    this.router.navigate(['/']);
  }
}
