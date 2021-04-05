import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IVenta } from '../venta.model';
import { VentaService } from '../service/venta.service';
import { VentaDeleteDialogComponent } from '../delete/venta-delete-dialog.component';

@Component({
  selector: 'jhi-venta',
  templateUrl: './venta.component.html',
})
export class VentaComponent implements OnInit {
  ventas?: IVenta[];
  isLoading = false;

  constructor(protected ventaService: VentaService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.ventaService.query().subscribe(
      (res: HttpResponse<IVenta[]>) => {
        this.isLoading = false;
        this.ventas = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IVenta): number {
    return item.id!;
  }

  delete(venta: IVenta): void {
    const modalRef = this.modalService.open(VentaDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.venta = venta;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
