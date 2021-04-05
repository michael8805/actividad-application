import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IVenta, getVentaIdentifier } from '../venta.model';

export type EntityResponseType = HttpResponse<IVenta>;
export type EntityArrayResponseType = HttpResponse<IVenta[]>;

@Injectable({ providedIn: 'root' })
export class VentaService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/ventas');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(venta: IVenta): Observable<EntityResponseType> {
    return this.http.post<IVenta>(this.resourceUrl, venta, { observe: 'response' });
  }

  update(venta: IVenta): Observable<EntityResponseType> {
    return this.http.put<IVenta>(`${this.resourceUrl}/${getVentaIdentifier(venta) as number}`, venta, { observe: 'response' });
  }

  partialUpdate(venta: IVenta): Observable<EntityResponseType> {
    return this.http.patch<IVenta>(`${this.resourceUrl}/${getVentaIdentifier(venta) as number}`, venta, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IVenta>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IVenta[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addVentaToCollectionIfMissing(ventaCollection: IVenta[], ...ventasToCheck: (IVenta | null | undefined)[]): IVenta[] {
    const ventas: IVenta[] = ventasToCheck.filter(isPresent);
    if (ventas.length > 0) {
      const ventaCollectionIdentifiers = ventaCollection.map(ventaItem => getVentaIdentifier(ventaItem)!);
      const ventasToAdd = ventas.filter(ventaItem => {
        const ventaIdentifier = getVentaIdentifier(ventaItem);
        if (ventaIdentifier == null || ventaCollectionIdentifiers.includes(ventaIdentifier)) {
          return false;
        }
        ventaCollectionIdentifiers.push(ventaIdentifier);
        return true;
      });
      return [...ventasToAdd, ...ventaCollection];
    }
    return ventaCollection;
  }
}
