jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IProducto, Producto } from '../producto.model';
import { ProductoService } from '../service/producto.service';

import { ProductoRoutingResolveService } from './producto-routing-resolve.service';

describe('Service Tests', () => {
  describe('Producto routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: ProductoRoutingResolveService;
    let service: ProductoService;
    let resultProducto: IProducto | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(ProductoRoutingResolveService);
      service = TestBed.inject(ProductoService);
      resultProducto = undefined;
    });

    describe('resolve', () => {
      it('should return IProducto returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultProducto = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultProducto).toEqual({ id: 123 });
      });

      it('should return new IProducto if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultProducto = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultProducto).toEqual(new Producto());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultProducto = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultProducto).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
