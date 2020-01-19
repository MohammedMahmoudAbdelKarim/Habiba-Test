import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MainServiceService } from '../../shared-services/main-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  templateUrl: 'options.component.html'
})
export class OptionsComponent implements OnInit {
  /* ------------------------------------- Variables ------------------------ */
  // Modals
  @ViewChild('myModal', { static: false }) public myModal: ModalDirective;
  @ViewChild('myModal2', { static: false }) public myModal2: ModalDirective;
  /* ------------------------------------- Form ------------------------ */
  // Main Form
  settingsForm = new FormGroup({
    dollar_price: new FormControl('', Validators.required),
    website: new FormControl('', Validators.required),
    address: new FormControl('', Validators.required),
    phone: new FormControl('')
  });

  errorMessage: any = {};
  dollar_error1: any = '';
  dollar_error2: any = '';

  constructor(
    private api: MainServiceService,
    private route: ActivatedRoute,
    private router: Router,
    private toast: ToastrService
  ) {}
  /* ----------------------------------- OnInit ------------------------ */
  // tslint:disable-next-line: use-lifecycle-interface
  ngOnInit() {}

  /* ------------------------------- On Submit ----------------------------- */
  onSubmit(form) {
    console.log(form);
    this.api.post('settings/update', form).subscribe(
      data => {
        console.log(data);
        this.toast.success('Changes have been successfully Saved', 'Success!', {
          timeOut: 1000
        });
        this.router.navigateByUrl('/dashboard');
      },
      error => {
        console.log(error.error.errors);
        this.errorMessage = error.error.errors;
        this.dollar_error1 = this.errorMessage.dollar_price[0];
        this.dollar_error2 = this.errorMessage.dollar_price[1];
      }
    );
  }
  /*--------------------------------- Logout -------------------------------- */
  logout() {
    sessionStorage.removeItem('token');
    this.router.navigate(['/']);
  }
}
