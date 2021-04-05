import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IVenta, Venta } from '../venta.model';
import { VentaService } from '../service/venta.service';

@Injectable({ providedIn: 'root' })
export class VentaRoutingResolveService implements Resolve<IVenta> {
  constructor(protected service: VentaService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IVenta> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((venta: HttpResponse<Venta>) => {
          if (venta.body) {
            return of(venta.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Venta());
  }
}
