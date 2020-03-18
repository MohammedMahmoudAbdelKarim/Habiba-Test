import { Component, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { FormControl, FormGroup } from '@angular/forms';
import { MainServiceService } from '../../shared-services/main-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
@Component({
  templateUrl: 'safe-box-action.component.html'
})
export class SafeBoxActionComponent {
  /* ----------------------------------- Variables ------------------------ */
  // Modals
  @ViewChild('myModalPayment', { static: false })
  public myModalPayment: ModalDirective;
  @ViewChild('myModalTransfer', { static: false })
  public myModalTransfer: ModalDirective;
  // Arrays and Inital Variables
  safeBoxArray: any = [];
  modalError: any = [];
  branchesList: any = [];
  branch_id: any = '';
  payment_method: any = 1;
  branch_name: any = '';
  /* ----------------------------------- Form ------------------------ */
  // Add Payment Form
  paymentForm = new FormGroup({
    payment_amount: new FormControl(''),
    reason: new FormControl('')
  });
  // Transfer Money Form
  transferMoney = new FormGroup({
    branch_id: new FormControl(''),
    payment_amount: new FormControl('')
  });
  /* ----------------------------------- Constructor ------------------------ */
  constructor(
    private api: MainServiceService,
    private router: Router,
    private route: ActivatedRoute,
    private toast: ToastrService
  ) {
    this.route.data.subscribe(data => {
      // ------------- Get Safe Boxes
      this.safeBoxArray = data.safeBoxs.data.data;
      console.log(data.safeBoxs.data.data);
      // ------------- Get Branches
      this.branchesList = data.branchList.data;
      console.log(data.branchList.data);
    });
  }
  /* ----------------------------------- OnInit ------------------------ */
  // tslint:disable-next-line: use-lifecycle-interface
  ngOnInit() {}
  /* ----------------------------------- Make Empty ------------------------ */
  getEmpty(row) {
    this.api
      .post('savebox/empty', {
        branch_id: row.branches.id
      })
      .subscribe(value => {
        console.log(value);
        this.toast.success("The branch's safe box is empty Now!", '!Success');
        this.api
          .get('savebox/index', {
            per_page: 50
          })
          .subscribe(data => {
            this.safeBoxArray = data.data.data;
          });
      });
  }
  /* -------------------------- Get Payment Method ------------------------- */
  getPaymentType(event) {
    console.log(event);
    this.payment_method = event;
  }
  /* --------------------------------- Get Branch ID ------------------------ */
  getBranch(row) {
    this.myModalPayment.show();
    this.paymentForm.reset();
    this.modalError = [];
    this.branch_id = row.branches.id;
  }
  /* ----------------------- Get Transfer --------------------- */
  makeTransfer(row) {
    this.transferMoney.reset();
    console.log(row);
    this.branch_name = row.branches.name;
    this.branch_id = row.branches.id;
    this.myModalTransfer.show();
  }
  /* --------------------------------- Make Payment ------------------------ */
  onSubmitPayment(form) {
    this.api
      .post('savebox/add', {
        payment_amount: form.value.payment_amount,
        reason: form.value.reason,
        payment_method: this.payment_method,
        branch_id: this.branch_id
      })
      .subscribe(
        value => {
          this.myModalPayment.hide();
          this.toast.success('Thank You !', '!Success');
          this.api
            .get('savebox/index', {
              per_page: 50
            })
            .subscribe(data => {
              this.safeBoxArray = data.data.data;
            });
        },
        error => {
          this.modalError = error.error.message;
        }
      );
  }

  /* -------------------------- Get Money Transfer ---------------------- */
  onSubmitTransfer(form) {
    console.log(form.value);
    this.api
      .post('savebox/transfer', {
        payment_amount: this.transferMoney.controls.payment_amount.value,
        from_branch: this.branch_id,
        to_branch: this.transferMoney.controls.branch_id.value,
        reasone: '',
        payment_method: this.payment_method
      })
      .subscribe(data => {
        console.log(data);
        this.myModalTransfer.hide();
        this.api
          .get('savebox/index', {
            per_page: 50
          })
          .subscribe(data => {
            this.safeBoxArray = data.data.data;
          });
      });
  }

  /* ----------------------- Get Branch ID ------------------------ */
  getSelectedListOptionId(event) {
    console.log(event.target.value);
    this.api
      .get('savebox/index', {
        branch_id: event.target.value
      })
      .subscribe(data => {
        console.log(data);
        this.safeBoxArray = data.data.data;
      });
  }
  /*--------------------------------- Logout ------------------------------ */
  logout() {
    sessionStorage.removeItem('token');
    this.router.navigate(['/']);
  }
}
