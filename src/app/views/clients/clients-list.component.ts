import { Component, Inject, OnInit, ViewChild } from '@angular/core';
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
  templateUrl: 'clients-list.component.html'
})
export class ClientsListComponent implements OnInit {
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
    'mobile',
    'email',
    'created_at',
    'actions'
  ];
  dataSource: MatTableDataSource<any> = new MatTableDataSource([]);
  selection = new SelectionModel<any>(true, []);
  // Sort & Pagination
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  // Boolean
  showUpdataPopup: boolean = false;
  showDeletePopup: boolean = false;
  DeletingHold: boolean = false;
  deleteFlage: boolean = false;
  flage: boolean = false;
  // ASYNC
  filteredclients: Observable<string[]>;
  // Arrays and Inital Variables
  hideme: any = [];
  modalError: any = [];
  clientList: any = [];
  clientData: any = '';
  clientValue: any = '';
  deleteItem: any;
  data: any;
  pageEvent: any;
  checkedItems: any = 0;
  pageSize: number = 50;
  per_page: number = 50;
  currentPage: number = 1;
  numberOfPages: any = [];
  pageIndex: any;
  // Form Controls
  clientNameData = new FormControl('');
  /* ------------------------------------- Form ------------------------ */
  // Delete Form
  deleteForm = new FormGroup({
    deleteInput: new FormControl('')
  });
  // Client Form
  clientsForm = new FormGroup({
    id: new FormControl(''),
    name: new FormControl('', Validators.required),
    mobile: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required)
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
      // Get Clients
      this.clientList = data.clients.data;
      this.pageIndex = data.clients.data.last_page;
      this.dataSource = new MatTableDataSource(data.clients.data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.data = Object.assign(data.clients.data);
    });
    // Filter Clients
    this.filteredclients = this.clientNameData.valueChanges.pipe(
      startWith(''),
      map(value => this.filterClient(value))
    );
  }

  /* ----------------------------------- OnInit ------------------------ */
  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    // this.numberOfPages = [];
    // for (let i = 1; i <= this.pageIndex; i++) {
    //   console.log(i);
    //   this.numberOfPages.push(i);
    //   this.numberOfPages.sort(function(a, b) {
    //     return a - b;
    //   });
    // }
    // console.log(this.numberOfPages);
  }
  /* ---------------------------- Filter Clients ------------------------ */
  private filterClient(value) {
    // tslint:disable-next-line: triple-equals
    if (value == '' || value == undefined) {
      this.api.get('clients', {}).subscribe(data => {
        this.dataSource = new MatTableDataSource(data.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
    }
    // tslint:disable-next-line: triple-equals
    if (typeof value == 'object') {
      const filterValue = value.name.toLowerCase();
      const filterMobile = value.mobile;
      // Send Request
      this.api
        .get('clients', {
          name: value.name,
          per_page: 50
        })
        // tslint:disable-next-line: no-shadowed-variable
        .subscribe(value => {
          this.dataSource = new MatTableDataSource(value.data);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
        });
      return this.clientList.filter(
        option =>
          option.name.toLowerCase().includes(filterValue) ||
          option.mobile.includes(filterMobile)
      );
      // tslint:disable-next-line: triple-equals
    } else if (typeof value == 'string') {
      const filterValueName = value.toLowerCase();
      const filterMobile = value;
      const info = this.clientList.filter(
        option =>
          option.name.toLowerCase().includes(filterValueName) ||
          option.mobile.includes(filterMobile)
      );
      this.dataSource = new MatTableDataSource(info);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      return this.clientList.filter(
        option =>
          option.name.toLowerCase().includes(filterValueName) ||
          option.mobile.includes(filterMobile)
      );
    }
  }
  /* ---------------------------- Display Clients ------------------------ */
  displayclient(client): string {
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
  /* ---------------------------- Remove Multi-Items ------------------------ */
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
        .delete('clients', { params: { 'ids[]': ids } })
        .subscribe(data => {
          this.toast.success('The Clients are Successfully delete', '!Success');
          this.delete2Modal.hide();
          this.api.get('clients').subscribe(value => {
            this.dataSource = new MatTableDataSource(value.data.data);
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
          });
        });
    } else {
      this.api.fireAlert('error', 'Error in writing "DELETE"', '');
    }
  }
  /* -------------------------- Create New Clients ----------------------- */
  onSubmitClient(form) {
    this.api.post('clients', form.value).subscribe(
      value => {
        // tslint:disable-next-line: no-shadowed-variable
        this.api.get('clients/active').subscribe(value => {
          this.clientList = value;
        });
        this.toast.success(
          form.value.name + ' ' + ' has been successfully Created',
          'Success!',
          {
            timeOut: 1000
          }
        );
        this.myModal.hide();
        this.api
          .get('clients', {
            per_page: 50
          })
          .subscribe(data => {
            // Get Clients
            this.clientList = data.data.data;
            this.dataSource = new MatTableDataSource(data.data.data);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          });
      },
      // Catch Error
      error => {
        this.modalError = error.error.errors;
        this.api.fireAlert('error', 'Please Fill All Data', '');
      }
    );
  }
  /* -------------------------- Update Clients ----------------------------- */
  onUpdateclient(form) {
    this.api.put('clients/' + form.value.id, form.value).subscribe(
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
          .get('clients', {
            per_page: 50
          })
          .subscribe(data => {
            // Get Clients
            this.clientList = data.data.data;
            this.dataSource = new MatTableDataSource(data.data.data);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
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
  openUpdataPopup(clientData, stockId) {
    this.clientData = clientData;
    this.showUpdataPopup = true;
    this.myModal2.show();
    this.clientsForm.controls.id.setValue(clientData.id);
    this.clientsForm.controls.name.setValue(clientData.name);
    this.clientsForm.controls.mobile.setValue(clientData.mobile);
    this.clientsForm.controls.email.setValue(clientData.email);
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
  /* -------------------------- Delete Client ----------------------------- */
  deleteClient() {
    const upperDeleteInputValue = this.deleteForm.value.deleteInput;
    if (upperDeleteInputValue === 'DELETE') {
      this.api.delete('clients/' + this.deleteItem.id).subscribe(value => {
        // tslint:disable-next-line: triple-equals
        if (value['status'] == 'success') {
          this.toast.success(
            this.deleteItem.name + ' ' + 'has been Deleted',
            'Success!'
          );
          this.deleteModal.hide();
          this.api
            .get('clients', {
              per_page: 50
            })
            // tslint:disable-next-line: no-shadowed-variable
            .subscribe(value => {
              this.dataSource = new MatTableDataSource(value.data.data);
              this.dataSource.paginator = this.paginator;
              this.dataSource.sort = this.sort;
            });
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
    // this.per_page = event.pageSize;
    // this.api
    //   .get('clients', {
    //     per_page: event.pageSize
    //   })
    //   .subscribe((value: any) => {
    //     this.dataSource = new MatTableDataSource(value.data.data);
    //     this.pageIndex = value.data.last_page;
    //     this.dataSource.sort = this.sort;
    //     this.dataSource.paginator = this.paginator;
    //   });
    // console.log(this.pageIndex);
    // this.numberOfPages = [];
    // for (let i = 1; i <= this.pageIndex; i++) {
    //   console.log(i);
    //   this.numberOfPages.push(i);
    //   this.numberOfPages.sort(function(a, b) {
    //     return a - b;
    //   });
    // }
    // console.log(this.numberOfPages);
  }
  selectPage(event) {
    console.log(event);
    // this.currentPage = event;
    // this.api
    //   .get('clients', {
    //     per_page: 10,
    //     page: event
    //   })
    //   .subscribe((productList: any) => {
    //     console.log(productList.data.data);
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
