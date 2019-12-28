import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { ActivatedRouteSnapshot } from '@angular/router';

import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { MainServiceService } from '../shared-services/main-service.service';

@Injectable()
// tslint:disable-next-line: class-name
export class statusListSolver implements Resolve<any> {
  constructor(private mainService: MainServiceService) {}

  resolve() {
    return this.mainService.get('products/states').pipe(
      catchError(error => {
        return of('No Data');
      })
    );
  }
}
