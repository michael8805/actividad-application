jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IVenta, Venta } from '../venta.model';
import { VentaService } from '../service/venta.service';

import { VentaRoutingResolveService } from './venta-routing-resolve.service';

describe('Service Tests', () => {
  describe('Venta routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: VentaRoutingResolveService;
    let service: VentaService;
    let resultVenta: IVenta | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(VentaRoutingResolveService);
      service = TestBed.inject(VentaService);
      resultVenta = undefined;
    });

    describe('resolve', () => {
      it('should return IVenta returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultVenta = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultVenta).toEqual({ id: 123 });
      });

      it('should return new IVenta if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultVenta = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultVenta).toEqual(new Venta());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultVenta = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultVenta).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
