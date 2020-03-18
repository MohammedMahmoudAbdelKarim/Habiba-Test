import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import Swal from 'sweetalert2';

@Injectable()
export class CoreService {
  // Variables
  baseUrl: string;
  http: HttpClient;
  constructor(url, http) {
    this.http = http;
    this.baseUrl = environment.baseUrl + url;
  }
  // Get Method
  get(path, params?) {
    return this.http.get<any>(this.baseUrl + path, { params: { ...params } });
  }
  // Post Method
  post(path, data) {
    return this.http.post<any>(this.baseUrl + path, data);
  }
  // Delete Method
  delete(path, data?) {
    return this.http.delete<any>(this.baseUrl + path, data);
  }
  // Update Method
  put(path, data) {
    return this.http.put<any>(this.baseUrl + path, data);
  }
  fireAlert(type, title, text) {
    Swal.fire({
      icon: type,
      title: title,
      text: text,
      confirmButtonText: 'Ok'
    });
  }
}
