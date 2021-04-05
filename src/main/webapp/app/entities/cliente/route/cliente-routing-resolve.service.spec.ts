jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { ICliente, Cliente } from '../cliente.model';
import { ClienteService } from '../service/cliente.service';

import { ClienteRoutingResolveService } from './cliente-routing-resolve.service';

describe('Service Tests', () => {
  describe('Cliente routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: ClienteRoutingResolveService;
    let service: ClienteService;
    let resultCliente: ICliente | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(ClienteRoutingResolveService);
      service = TestBed.inject(ClienteService);
      resultCliente = undefined;
    });

    describe('resolve', () => {
      it('should return ICliente returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultCliente = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultCliente).toEqual({ id: 123 });
      });

      it('should return new ICliente if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultCliente = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultCliente).toEqual(new Cliente());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultCliente = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultCliente).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
