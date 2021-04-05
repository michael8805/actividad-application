import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IProducto, Producto } from '../producto.model';

import { ProductoService } from './producto.service';

describe('Service Tests', () => {
  describe('Producto Service', () => {
    let service: ProductoService;
    let httpMock: HttpTestingController;
    let elemDefault: IProducto;
    let expectedResult: IProducto | IProducto[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(ProductoService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        idproducto: 0,
        descripcion: 'AAAAAAA',
        precio: 0,
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign({}, elemDefault);

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Producto', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Producto()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Producto', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            idproducto: 1,
            descripcion: 'BBBBBB',
            precio: 1,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Producto', () => {
        const patchObject = Object.assign({}, new Producto());

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Producto', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            idproducto: 1,
            descripcion: 'BBBBBB',
            precio: 1,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Producto', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addProductoToCollectionIfMissing', () => {
        it('should add a Producto to an empty array', () => {
          const producto: IProducto = { id: 123 };
          expectedResult = service.addProductoToCollectionIfMissing([], producto);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(producto);
        });

        it('should not add a Producto to an array that contains it', () => {
          const producto: IProducto = { id: 123 };
          const productoCollection: IProducto[] = [
            {
              ...producto,
            },
            { id: 456 },
          ];
          expectedResult = service.addProductoToCollectionIfMissing(productoCollection, producto);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Producto to an array that doesn't contain it", () => {
          const producto: IProducto = { id: 123 };
          const productoCollection: IProducto[] = [{ id: 456 }];
          expectedResult = service.addProductoToCollectionIfMissing(productoCollection, producto);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(producto);
        });

        it('should add only unique Producto to an array', () => {
          const productoArray: IProducto[] = [{ id: 123 }, { id: 456 }, { id: 40645 }];
          const productoCollection: IProducto[] = [{ id: 123 }];
          expectedResult = service.addProductoToCollectionIfMissing(productoCollection, ...productoArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const producto: IProducto = { id: 123 };
          const producto2: IProducto = { id: 456 };
          expectedResult = service.addProductoToCollectionIfMissing([], producto, producto2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(producto);
          expect(expectedResult).toContain(producto2);
        });

        it('should accept null and undefined values', () => {
          const producto: IProducto = { id: 123 };
          expectedResult = service.addProductoToCollectionIfMissing([], null, producto, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(producto);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
