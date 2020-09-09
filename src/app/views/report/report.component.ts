import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { MainServiceService } from '../../shared-services/main-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { startWith, map } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { LoaderService } from '../../shared-services/loader.service';
@Component({
  templateUrl: 'report.component.html'
})
export class ReportComponent implements OnInit {
  /* ------------------------------------- Variables ------------------------ */

  htmlDoc: any = '';
  // Form Controls
  isLoading: Subject<boolean> = this.loaderService.isLoading;

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
    private router: Router,
    private loaderService: LoaderService
  ) {
    this.route.queryParams.subscribe(data => {
      console.log(data);
      if (data.page == 'stockList') {
        // Products
        this.api
          .get('products', {
            pdf: 1,
            branch_id: data.branch_id,
            category_id: data.category_id,
            label: data.label,
            status_id: data.status_id
          })
          .subscribe(
            products => {},
            error => {
              this.htmlDoc = error.error.text;
            }
          );
      } else if (data.page == 'transfer') {
        this.api
          .get('transfer', {
            pdf: 1,
            label: data.label
          })
          .subscribe(
            transfers => {},
            error => {
              this.htmlDoc = error.error.text;
            }
          );
      } else if (data.page == 'saleList') {
        this.api
          .get('sales', {
            pdf: 1,
            branch_id: data.branch_id,
            receipt_number: data.receipt_number,
            metal_type: data.metal_type,
            from_date: data.from_date,
            to_date: data.to_date
          })
          .subscribe(
            transfers => {},
            error => {
              this.htmlDoc = error.error.text;
            }
          );
      } else if (data.page == 'reseller') {
        this.api
          .get('reseller', {
            pdf: 1,
            branch_id: data.branch_id,
            client_id: data.client_id,
            reseller_id: data.reseller_id,
            from_date: data.from_date,
            to_date: data.to_date,
            product_id: data.product_id
          })
          .subscribe(
            transfers => {},
            error => {
              this.htmlDoc = error.error.text;
            }
          );
      } else if (data.page == 'saveBox') {
        this.api
          .get('savebox/actions', {
            pdf: 1,
            branch_id: data.branch_id,
            status: data.status,
            from_date: data.from_date,
            to_date: data.to_date,
            payment_method: data.payment_method
          })
          .subscribe(
            transfers => {},
            error => {
              this.htmlDoc = error.error.text;
            }
          );
      }
    });

    // this.route.data.subscribe(
    //   data => {
    //     console.log(data);
    // Get Users
    // this.userList = data.user.data.data;
    // this.dataSource = new MatTableDataSource(data.user.data.data);
    // this.pageIndex = data.user.data.last_page;
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
    // this.data = Object.assign(data.user.data.data);
    // },
    // );
  }
  /* ----------------------------------- OnInit ------------------------ */
  ngOnInit() {}
}
