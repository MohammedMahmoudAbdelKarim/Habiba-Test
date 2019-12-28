import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CoreService } from './core.service';

@Injectable({
  providedIn: 'root'
})
export class MainServiceService extends CoreService {
  constructor(http: HttpClient) {
    super('', http);
  }
}
