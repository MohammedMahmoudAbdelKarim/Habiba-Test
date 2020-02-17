import { Component, ViewChild, OnInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
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
  templateUrl: 'categories.component.html'
})
export class CategoriesComponent implements OnInit {
  /* ------------------------------------- Variables ------------------------ */
  // Modals
  @ViewChild('myModal', { static: false }) public myModal: ModalDirective;
  @ViewChild('myModal2', { static: false }) public myModal2: ModalDirective;
  @ViewChild('deleteModal', { static: false })
  public deleteModal: ModalDirective;
  // Tables Colums
  selection = new SelectionModel<any>(true, []);
  displayedColumns: string[] = ['select', 'id', 'name', 'code', 'details'];
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
  filteredcategories: Observable<string[]>;
  // Arrays and Inital Variables
  hideme: any = [];
  modalError: any = [];
  categoriesList: any = [];
  categoryList: any = [];
  categoryData: any = '';
  categoryValue: string = '';
  deleteItem: any;
  pageEvent: any;
  pageSize: number = 50;
  per_page: number = 50;
  pageIndex;
  numberOfPages = [];
  currentPage;
  // Form Controls
  myControlcategory = new FormControl('');
  /* ------------------------------------- Form ------------------------ */
  // Delete Form
  deleteForm = new FormGroup({
    deleteInput: new FormControl('')
  });
  // Category Form
  categoriesForm = new FormGroup({
    id: new FormControl(''),
    name: new FormControl('', Validators.required),
    code: new FormControl('', Validators.required)
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
      // Get categories
      this.categoryList = data.categories.data.data;
      this.dataSource = new MatTableDataSource(data.categories.data.data);
      this.pageIndex = data.categories.data.last_page;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
    // Filter categories
    this.filteredcategories = this.myControlcategory.valueChanges.pipe(
      startWith(''),
      map(value => this.filtercategory(value))
    );
  }
  /* ----------------------------------- OnInit ------------------------ */
  ngOnInit() {
    for (let i = 1; i <= this.pageIndex; i++) {
      console.log(i);
      this.numberOfPages.push(i);
      this.numberOfPages.sort(function(a, b) {
        return a - b;
      });
    }
    console.log(this.numberOfPages);
  }
  /* ---------------------------- Filter Categories ------------------------ */
  private filtercategory(value) {
    // tslint:disable-next-line: triple-equals
    if (value == '' || value == undefined) {
      this.api.get('categories', { per_page: 50 }).subscribe(data => {
        //  Get Categories
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
        .get('categories', {
          name: value.name,
          per_page: 50
        })
        // tslint:disable-next-line: no-shadowed-variable
        .subscribe(value => {
          this.dataSource = new MatTableDataSource(value.data.data);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
        });
      return this.categoryList.filter(option =>
        option.name.toLowerCase().includes(filterValue)
      );
      // tslint:disable-next-line: triple-equals
    } else if (typeof value == 'string') {
      const filterValueName = value.toLowerCase();
      const info = this.categoryList.filter(option =>
        option.name.toLowerCase().includes(filterValueName)
      );
      this.dataSource = new MatTableDataSource(info);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      return this.categoryList.filter(option =>
        option.name.toLowerCase().includes(filterValueName)
      );
    }
  }
  /* ---------------------------- Display Categories ------------------------ */
  displaycategory(category): string {
    return category ? category.name : category;
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
  /* -------------------------- Create New Categories ----------------------- */
  onSubmitcategory(form) {
    this.api.post('categories', form.value).subscribe(
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
          .get('categories', {
            per_page: 50
          })
          .subscribe(data => {
            // Get Categories
            this.categoryList = data.data.data;
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
  /* -------------------------- Update Category ----------------------------- */
  onUpdatecategory(form) {
    this.api.put('categories/' + form.value.id, form.value).subscribe(
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
          .get('categories', {
            per_page: 50
          })
          .subscribe(data => {
            // Get categories
            this.categoryList = data.data.data;
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
  // Open Update Popup
  openUpdataPopup(categoryData) {
    this.categoryData = categoryData;
    this.showUpdataPopup = true;
    this.myModal.show();
    this.categoriesForm.controls.id.setValue(categoryData.id);
    this.categoriesForm.controls.name.setValue(categoryData.name);
    this.categoriesForm.controls.code.setValue(categoryData.code);
  }
  // Open Delete Popup
  opendeletePopup(row) {
    console.log(row);
    this.deleteItem = row;
    this.deleteForm.controls.deleteInput.setValue('');
    this.deleteModal.show();
  }
  /* -------------------------- Delete Category ----------------------------- */
  deleteCategory() {
    const upperDeleteInputValue = this.deleteForm.value.deleteInput;
    if (upperDeleteInputValue === 'DELETE') {
      this.api.delete('categories/' + this.deleteItem.id).subscribe(
        data => {
          console.log(data);
          // tslint:disable-next-line: triple-equals
          if (data['status'] == 'success') {
            this.deleteModal.hide();
            this.toast.success(
              this.deleteItem.name + ' ' + 'has been Deleted',
              'Success!'
            );
            // tslint:disable-next-line: no-shadowed-variable
            this.api
              .get('categories', { per_page: 50 })
              // tslint:disable-next-line: no-shadowed-variable
              .subscribe(data => {
                this.categoryList = data.data.data;
                this.dataSource = new MatTableDataSource(data.data.data);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
              });
          }
        },
        error => {
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
    console.log(event);
    this.per_page = event.pageSize;
    this.api
      .get('categories', {
        per_page: event.pageSize,
        page: 1
      })
      .subscribe((productList: any) => {
        console.log(productList);
        this.pageIndex = productList.data.last_page;
        this.dataSource = new MatTableDataSource(productList.data.data);
        this.pageIndex = productList.data.last_page;
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;

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
      .get('categories', {
        per_page: this.per_page,
        page: event
      })
      .subscribe((productList: any) => {
        console.log(productList.data.data);
        this.pageIndex = productList.data.last_page;
        this.dataSource = new MatTableDataSource(productList.data.data);
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
