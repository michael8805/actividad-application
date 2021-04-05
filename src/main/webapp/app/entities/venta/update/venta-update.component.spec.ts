jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { VentaService } from '../service/venta.service';
import { IVenta, Venta } from '../venta.model';
import { ICliente } from 'app/entities/cliente/cliente.model';
import { ClienteService } from 'app/entities/cliente/service/cliente.service';
import { IProducto } from 'app/entities/producto/producto.model';
import { ProductoService } from 'app/entities/producto/service/producto.service';

import { VentaUpdateComponent } from './venta-update.component';

describe('Component Tests', () => {
  describe('Venta Management Update Component', () => {
    let comp: VentaUpdateComponent;
    let fixture: ComponentFixture<VentaUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let ventaService: VentaService;
    let clienteService: ClienteService;
    let productoService: ProductoService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [VentaUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(VentaUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(VentaUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      ventaService = TestBed.inject(VentaService);
      clienteService = TestBed.inject(ClienteService);
      productoService = TestBed.inject(ProductoService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call idCliente query and add missing value', () => {
        const venta: IVenta = { id: 456 };
        const idCliente: ICliente = { id: 10229 };
        venta.idCliente = idCliente;

        const idClienteCollection: ICliente[] = [{ id: 73752 }];
        spyOn(clienteService, 'query').and.returnValue(of(new HttpResponse({ body: idClienteCollection })));
        const expectedCollection: ICliente[] = [idCliente, ...idClienteCollection];
        spyOn(clienteService, 'addClienteToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ venta });
        comp.ngOnInit();

        expect(clienteService.query).toHaveBeenCalled();
        expect(clienteService.addClienteToCollectionIfMissing).toHaveBeenCalledWith(idClienteCollection, idCliente);
        expect(comp.idClientesCollection).toEqual(expectedCollection);
      });

      it('Should call idProducto query and add missing value', () => {
        const venta: IVenta = { id: 456 };
        const idProducto: IProducto = { id: 22191 };
        venta.idProducto = idProducto;

        const idProductoCollection: IProducto[] = [{ id: 90204 }];
        spyOn(productoService, 'query').and.returnValue(of(new HttpResponse({ body: idProductoCollection })));
        const expectedCollection: IProducto[] = [idProducto, ...idProductoCollection];
        spyOn(productoService, 'addProductoToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ venta });
        comp.ngOnInit();

        expect(productoService.query).toHaveBeenCalled();
        expect(productoService.addProductoToCollectionIfMissing).toHaveBeenCalledWith(idProductoCollection, idProducto);
        expect(comp.idProductosCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const venta: IVenta = { id: 456 };
        const idCliente: ICliente = { id: 98890 };
        venta.idCliente = idCliente;
        const idProducto: IProducto = { id: 20001 };
        venta.idProducto = idProducto;

        activatedRoute.data = of({ venta });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(venta));
        expect(comp.idClientesCollection).toContain(idCliente);
        expect(comp.idProductosCollection).toContain(idProducto);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const venta = { id: 123 };
        spyOn(ventaService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ venta });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: venta }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(ventaService.update).toHaveBeenCalledWith(venta);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const venta = new Venta();
        spyOn(ventaService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ venta });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: venta }));
        saveSubject.complete();

        // THEN
        expect(ventaService.create).toHaveBeenCalledWith(venta);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const venta = { id: 123 };
        spyOn(ventaService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ venta });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(ventaService.update).toHaveBeenCalledWith(venta);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackClienteById', () => {
        it('Should return tracked Cliente primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackClienteById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackProductoById', () => {
        it('Should return tracked Producto primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackProductoById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
