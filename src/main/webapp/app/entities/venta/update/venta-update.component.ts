import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IVenta, Venta } from '../venta.model';
import { VentaService } from '../service/venta.service';
import { ICliente } from 'app/entities/cliente/cliente.model';
import { ClienteService } from 'app/entities/cliente/service/cliente.service';
import { IProducto } from 'app/entities/producto/producto.model';
import { ProductoService } from 'app/entities/producto/service/producto.service';

@Component({
  selector: 'jhi-venta-update',
  templateUrl: './venta-update.component.html',
})
export class VentaUpdateComponent implements OnInit {
  isSaving = false;

  idClientesCollection: ICliente[] = [];
  idProductosCollection: IProducto[] = [];

  editForm = this.fb.group({
    id: [],
    idventa: [],
    cantidad: [],
    idCliente: [],
    idProducto: [],
    idCliente: [],
    idProducto: [],
  });

  constructor(
    protected ventaService: VentaService,
    protected clienteService: ClienteService,
    protected productoService: ProductoService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ venta }) => {
      this.updateForm(venta);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const venta = this.createFromForm();
    if (venta.id !== undefined) {
      this.subscribeToSaveResponse(this.ventaService.update(venta));
    } else {
      this.subscribeToSaveResponse(this.ventaService.create(venta));
    }
  }

  trackClienteById(index: number, item: ICliente): number {
    return item.id!;
  }

  trackProductoById(index: number, item: IProducto): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IVenta>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(venta: IVenta): void {
    this.editForm.patchValue({
      id: venta.id,
      idventa: venta.idventa,
      cantidad: venta.cantidad,
      idCliente: venta.idCliente,
      idProducto: venta.idProducto,
      idCliente: venta.idCliente,
      idProducto: venta.idProducto,
    });

    this.idClientesCollection = this.clienteService.addClienteToCollectionIfMissing(this.idClientesCollection, venta.idCliente);
    this.idProductosCollection = this.productoService.addProductoToCollectionIfMissing(this.idProductosCollection, venta.idProducto);
  }

  protected loadRelationshipsOptions(): void {
    this.clienteService
      .query({ filter: 'venta-is-null' })
      .pipe(map((res: HttpResponse<ICliente[]>) => res.body ?? []))
      .pipe(
        map((clientes: ICliente[]) => this.clienteService.addClienteToCollectionIfMissing(clientes, this.editForm.get('idCliente')!.value))
      )
      .subscribe((clientes: ICliente[]) => (this.idClientesCollection = clientes));

    this.productoService
      .query({ filter: 'venta-is-null' })
      .pipe(map((res: HttpResponse<IProducto[]>) => res.body ?? []))
      .pipe(
        map((productos: IProducto[]) =>
          this.productoService.addProductoToCollectionIfMissing(productos, this.editForm.get('idProducto')!.value)
        )
      )
      .subscribe((productos: IProducto[]) => (this.idProductosCollection = productos));
  }

  protected createFromForm(): IVenta {
    return {
      ...new Venta(),
      id: this.editForm.get(['id'])!.value,
      idventa: this.editForm.get(['idventa'])!.value,
      cantidad: this.editForm.get(['cantidad'])!.value,
      idCliente: this.editForm.get(['idCliente'])!.value,
      idProducto: this.editForm.get(['idProducto'])!.value,
      idCliente: this.editForm.get(['idCliente'])!.value,
      idProducto: this.editForm.get(['idProducto'])!.value,
    };
  }
}
