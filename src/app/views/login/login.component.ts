import { MainServiceService } from './../../shared-services/main-service.service';
import { FormGroup, FormControl } from '@angular/forms';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import * as jsPDF from 'jspdf';
@Component({
  selector: 'app-dashboard',
  templateUrl: 'login.component.html'
})
export class LoginComponent implements OnInit {
  login: FormGroup;
  errorMessage: any = [];
  @ViewChild('content', { static: false }) content: ElementRef;
  constructor(private api: MainServiceService, private router: Router) { }
  ngOnInit() {
    this.login = new FormGroup({
      email: new FormControl('habiba.k1997@gmail.com'),
      password: new FormControl('123456')
    });
  }
  onLogin(form) {
    console.log(form);
    this.api
      .post('login', {
        email: form.value.email,
        password: form.value.password,
        scope: '*'
      })
      .toPromise()
      .then(res => {
        console.log(res);
        const token = res.access_token;
        sessionStorage.setItem('token', token);
        this.router.navigate(['/dashboard']);
      })
      .catch(error => {
        console.log('Error : ', error);
        this.errorMessage = error.error.errors;
      });
  }
}
